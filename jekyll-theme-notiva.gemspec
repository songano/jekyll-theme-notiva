# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "jekyll-theme-notiva"
  spec.version       = "0.1.0"
  spec.authors       = ["Gano Son"]
  spec.email         = ["dungcho93@gmail.com"]

  spec.summary       = "Developer-friendly technical blog theme for Jekyll with modern features and optimized performance"
  spec.homepage      = "https://github.com/songano/jekyll-theme-notiva"
  spec.license       = "MIT"

  spec.metadata = {
    "bug_tracker_uri"   => "https://github.com/songano/jekyll-theme-notiva/issues",
    "documentation_uri" => "https://github.com/songano/jekyll-theme-notiva/#readme",
    "homepage_uri"      => "https://songano.github.io/notiva-demo",
    "source_code_uri"   => "https://github.com/songano/jekyll-theme-notiva",
    "wiki_uri"          => "https://github.com/songano/jekyll-theme-notiva/wiki",
    "plugin_type"       => "theme"
  }

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_data|_layouts|_includes|_sass|LICENSE|README|_config\.yml)!i) }

  spec.required_ruby_version = "~> 3.4"

  spec.add_runtime_dependency "jekyll", "~> 4.4"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-include-cache", "~> 0.2.1"
end
