# _plugins/hooks/category_hierarchy.rb
# Purpose: Build a hierarchical structure of categories for use in navigation and templates
# This hook runs before site rendering and processes all post categories into a nested tree structure

Jekyll::Hooks.register :site, :pre_render do |site|
  # Collect all posts
  posts = site.posts.docs
  
  # Create hash to store the hierarchy
  hierarchy = {}
  
  # Phase 1: Collect post data and create base structure
  posts.each do |post|
    next unless post.data['categories']&.is_a?(Array) && post.data['categories'].any?
    
    categories = post.data['categories']
    post_info = {
      'title' => post.data['title'],
      'url' => post.url,
      'date' => post.date
    }
    
    # Build hierarchy structure and assign posts
    current_level = hierarchy
    categories.each_with_index do |category, depth|
      # Create category at current level (if doesn't exist)
      current_level[category] ||= {
        'name' => category,
        'slug' => Jekyll::Utils.slugify(category),
        'posts' => [],
        'direct_posts' => [],
        'total_posts' => 0,
        'children' => {}
      }
      
      # Add to all posts list
      current_level[category]['posts'] << post_info
      
      # Add to direct posts if this is the terminal category
      if depth == categories.size - 1
        current_level[category]['direct_posts'] << post_info
      end
      
      # Move to next level
      current_level = current_level[category]['children']
    end
  end
  
  # Phase 2: Calculate total post counts
  calculate_total_posts(hierarchy)
  
  # Phase 3: Sort the hierarchy
  sorted_hierarchy = sort_hierarchy(hierarchy)
  
  # Store in site data for access in templates
  site.data['category_hierarchy'] = sorted_hierarchy
end

# Recursively calculate total post counts
def calculate_total_posts(hierarchy)
  hierarchy.each_value do |category|
    calculate_category_posts(category)
  end
end

# Calculate total posts for a category and its subcategories
def calculate_category_posts(category)
  # Reuse if already calculated
  return category['total_posts'] if category['total_posts'] > 0
  
  # Count direct posts
  direct_count = category['direct_posts'].size
  
  # Count posts in subcategories
  children_count = 0
  category['children'].each_value do |child|
    children_count += calculate_category_posts(child)
  end
  
  # Store and return result
  category['total_posts'] = direct_count + children_count
end

# Helper method for natural sorting
# Transforms a string like "10. Chapter" into a sortable array like [10, ". Chapter"]
def natural_sort_key(str)
  # Split the string into groups of digits and non-digits
  # This creates an array where numbers are converted to integers for proper numerical comparison
  str.scan(/(\d+)|([^\d]+)/).map do |num, alpha|
    num ? num.to_i : alpha
  end
end

# Recursively sort hierarchy by category name and posts by title
def sort_hierarchy(hierarchy)
  # Create a new hash to store the sorted structure
  sorted_hierarchy = {}
  
  # Sort keys by natural sort order and rebuild the hash
  hierarchy.keys.sort_by { |category_name| natural_sort_key(category_name) }.each do |key|
    category = hierarchy[key]
    
    # Sort posts by title using natural sort
    category['posts'].sort_by! { |post| natural_sort_key(post['title']) }
    category['direct_posts'].sort_by! { |post| natural_sort_key(post['title']) }
    
    # Sort children recursively
    category['children'] = sort_hierarchy(category['children'])
    
    # Add to the sorted hash
    sorted_hierarchy[key] = category
  end
  
  sorted_hierarchy
end