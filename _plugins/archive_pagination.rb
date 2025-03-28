# frozen_string_literal: true

module JekyllArchivesPagination
  class ArchivePaginationPage < Jekyll::Page
    def initialize(site, base, dir, name, template, index, total, per_page, posts)
      @site = site
      @base = base
      @dir = dir
      @name = name

      self.process(@name)
      # 템플릿 페이지의 레이아웃을 사용
      if File.exist?(File.join(base, '_layouts', "#{template}.html"))
        self.read_yaml(File.join(base, '_layouts'), "#{template}.html")
      else
        Jekyll.logger.warn("Archives Pagination:", "레이아웃 파일을 찾을 수 없습니다: #{template}.html")
        self.content = ''
        self.data = {}
      end

      # 기존 데이터 복사
      type_parts = dir.split('/')
      archive_type = type_parts[0] # 'tags' 또는 'categories'
      term = type_parts[1] # 태그명 또는 카테고리명
      
      # 데이터 설정
      self.data['title'] = "#{term}"
      self.data['layout'] = template
      self.data['current_page'] = index
      self.data['total_pages'] = total
      self.data['per_page'] = per_page
      self.data['archive_type'] = archive_type
      self.data['term'] = term
      
      # 페이지네이션 정보
      pagination = {
        'page' => index,
        'per_page' => per_page,
        'posts' => posts,
        'total_posts' => posts.size,
        'total_pages' => total
      }
      
      # 네비게이션 링크 추가
      if index > 1
        pagination['previous_page'] = index - 1
        pagination['previous_page_path'] = index == 2 ? 
          "/#{archive_type}/#{term}/" : 
          "/#{archive_type}/#{term}/page/#{index - 1}/"
      end
      
      if index < total
        pagination['next_page'] = index + 1
        pagination['next_page_path'] = "/#{archive_type}/#{term}/page/#{index + 1}/"
      end
      
      pagination['first_page_path'] = "/#{archive_type}/#{term}/"
      pagination['last_page_path'] = total > 1 ? "/#{archive_type}/#{term}/page/#{total}/" : "/#{archive_type}/#{term}/"
      
      self.data['pagination'] = pagination
    end
  end

  class Generator < Jekyll::Generator
    safe true
    # jekyll-archives 이후 실행
    priority :lowest

    def generate(site)
      # 설정 가져오기
      pagination_config = site.config.fetch('pagination', {})
      enabled = pagination_config.fetch('enabled', false)
      per_page = pagination_config.fetch('per_page', 10)

      # 비활성화되어 있으면 실행하지 않음
      return unless enabled

      Jekyll.logger.info "Archives Pagination:", "시작 (페이지당 포스트: #{per_page})"

      # 카테고리와 태그 정보 수집
      process_collection(site, site.categories, 'categories', 'category', per_page)
      process_collection(site, site.tags, 'tags', 'tag', per_page)

      Jekyll.logger.info "Archives Pagination:", "완료"
    end

    def process_collection(site, collection, type, layout, per_page)
      collection.each do |term, posts|
        # 충분한 포스트가 있는 경우에만 페이지네이션 생성
        next if posts.size <= per_page

        # 첫 페이지는 jekyll-archives가 생성하므로 건너뜀
        # 대신 첫 페이지에 pagination 정보를 추가

        # 첫 페이지 찾기
        first_page = site.pages.find { |p| p.path == "#{type}/#{term}/index.html" }
        
        total_pages = (posts.size.to_f / per_page).ceil
        Jekyll.logger.info "Archives Pagination:", "#{type}/#{term} - #{posts.size}개 포스트, #{total_pages}개 페이지"

        # 날짜 기준으로 정렬
        sorted_posts = posts.sort_by { |post| -post.date.to_i }

        # 첫 페이지에 pagination 정보 추가
        if first_page
          first_page_posts = sorted_posts[0..(per_page-1)]
          
          pagination = {
            'page' => 1,
            'per_page' => per_page,
            'posts' => first_page_posts,
            'total_posts' => sorted_posts.size,
            'total_pages' => total_pages,
            'previous_page' => nil,
            'previous_page_path' => nil,
            'next_page' => total_pages > 1 ? 2 : nil,
            'next_page_path' => total_pages > 1 ? "/#{type}/#{term}/page/2/" : nil,
            'first_page_path' => "/#{type}/#{term}/",
            'last_page_path' => total_pages > 1 ? "/#{type}/#{term}/page/#{total_pages}/" : "/#{type}/#{term}/"
          }
          
          first_page.data['pagination'] = pagination
          first_page.data['term'] = term
          first_page.data['archive_type'] = type
          
          Jekyll.logger.info "Archives Pagination:", "첫 페이지에 pagination 정보 추가됨: #{type}/#{term}/index.html"
        else
          Jekyll.logger.warn "Archives Pagination:", "첫 페이지를 찾을 수 없습니다: #{type}/#{term}/index.html"
        end
        
        # 2페이지부터 새로 생성
        (2..total_pages).each do |page_num|
          start_idx = (page_num - 1) * per_page
          end_idx = [start_idx + per_page - 1, sorted_posts.size - 1].min
          paginated_posts = sorted_posts[start_idx..end_idx]

          # 페이지 경로 설정
          dir = "#{type}/#{term}/page/#{page_num}"

          # 페이지 생성
          page = ArchivePaginationPage.new(
            site, site.source, dir, 'index.html', 
            layout, page_num, total_pages, per_page, paginated_posts
          )

          # 사이트에 페이지 추가
          site.pages << page
          Jekyll.logger.info "Archives Pagination:", "페이지 생성: #{dir}/index.html"
        end
      end
    end
  end
end
