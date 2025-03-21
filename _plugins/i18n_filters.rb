# _plugins/i18n_filters.rb
module Jekyll
  module I18nFilters
    def t(key)
      locale = @context.registers[:site].data['locales'][@context.registers[:site].config['locale']]
      
      key.split('.').each do |k|
        locale = locale[k] if locale
      end
      
      locale || "Translation missing: #{key}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::I18nFilters)