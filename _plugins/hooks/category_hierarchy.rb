# _hooks/pre_render/build_category_hierarchy.rb

Jekyll::Hooks.register :site, :pre_render do |site|
  # 모든 포스트 수집
  posts = site.posts.docs
  
  # 계층 구조 저장할 해시 생성
  hierarchy = {}
  
  # 1단계: 포스트 데이터 수집 및 기본 구조 생성
  posts.each do |post|
    next unless post.data['categories']&.is_a?(Array) && post.data['categories'].any?
    
    categories = post.data['categories']
    post_info = {
      'title' => post.data['title'],
      'url' => post.url,
      'date' => post.date
    }
    
    # 계층 구조 생성 및 포스트 할당
    current_level = hierarchy
    categories.each_with_index do |category, depth|
      # 현재 레벨에 카테고리 생성 (없는 경우)
      current_level[category] ||= {
        'name' => category,
        'slug' => Jekyll::Utils.slugify(category),
        'posts' => [],
        'direct_posts' => [],
        'total_posts' => 0,
        'children' => {}
      }
      
      # 모든 포스트 목록에 추가
      current_level[category]['posts'] << post_info
      
      # 마지막 카테고리인 경우 직접 포스트에 추가
      if depth == categories.size - 1
        current_level[category]['direct_posts'] << post_info
      end
      
      # 다음 레벨로 이동
      current_level = current_level[category]['children']
    end
  end
  
  # 2단계: 총 포스트 수 계산
  calculate_total_posts(hierarchy)
  
  # 사이트 데이터에 저장
  site.data['category_hierarchy'] = hierarchy
end

# 재귀적으로 총 포스트 수 계산
def calculate_total_posts(hierarchy)
  hierarchy.each_value do |category|
    calculate_category_posts(category)
  end
end

# 카테고리와 하위 카테고리의 총 포스트 수 계산
def calculate_category_posts(category)
  # 이미 계산된 경우 재사용
  return category['total_posts'] if category['total_posts'] > 0
  
  # 직접 포스트 수
  direct_count = category['direct_posts'].size
  
  # 하위 카테고리 포스트 수
  children_count = 0
  category['children'].each_value do |child|
    children_count += calculate_category_posts(child)
  end
  
  # 결과 저장 및 반환
  category['total_posts'] = direct_count + children_count
end