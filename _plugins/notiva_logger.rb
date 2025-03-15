require 'jekyll'
require 'logger'

module Jekyll
  module Notiva
    # Pretty and minimal logger for Notiva theme
    class Logger < ::Logger
      # ANSI color codes for more attractive output
      COLORS = {
        error: "\e[31;1m", # Bold Red
        warn:  "\e[33;1m", # Bold Yellow
        info:  "\e[36;1m", # Bold Cyan
        debug: "\e[32m"    # Green
      }.freeze
      
      RESET = "\e[0m"
      THEME_PREFIX = "\e[38;5;105m★ Notiva\e[0m"

      def initialize(output = STDOUT)
        super(output)
        self.level = ENV['JEKYLL_LOG_LEVEL']&.downcase == 'debug' ? DEBUG : INFO
        self.formatter = proc do |severity, _, _, msg|
          color = COLORS[severity.downcase.to_sym] || ""
          "#{THEME_PREFIX} #{color}#{msg}#{RESET}\n"
        end
      end
      
      # Helper methods for cleaner logging
      def theme_info(msg)
        info("Theme v#{Jekyll.configuration['version'] || '0.1.0'}: #{msg}")
      end
      
      def build_step(msg)
        info("⚙️  #{msg}")
      end
      
      def success(msg)
        info("✓ #{msg}")
      end
    end

    # Simplified plugin implementation
    class LoggerPlugin < Jekyll::Plugin
      def self.init(site)
        notiva_logger = Notiva::Logger.new
        
        # Store our logger
        Jekyll.const_set(:NOTIVA_LOGGER, notiva_logger) unless Jekyll.const_defined?(:NOTIVA_LOGGER)
        
        # Welcome message
        notiva_logger.theme_info("Jekyll theme initialized")
        
        # Log enabled features if any
        if site.config['notiva'] && site.config['notiva']['features']
          features = site.config['notiva']['features']
          enabled = features.select { |_, v| v.is_a?(Hash) ? v['enabled'] : v }.keys
          notiva_logger.info("Enabled: #{enabled.join(', ')}") unless enabled.empty?
        end
        
        # Setup build hooks
        Jekyll::Hooks.register :site, :after_reset do |_|
          Jekyll::NOTIVA_LOGGER.build_step("Preparing site")
        end
        
        Jekyll::Hooks.register :site, :post_read do |site|
          Jekyll::NOTIVA_LOGGER.build_step("Processing #{site.pages.size} pages, #{site.posts.docs.size} posts")
        end
        
        Jekyll::Hooks.register :site, :post_write do |site|
          Jekyll::NOTIVA_LOGGER.success("Build completed → #{site.dest}")
        end
      end
    end
  end
end

# Initialize the logger
Jekyll::Hooks.register :site, :after_init do |site|
  Jekyll::Notiva::LoggerPlugin.init(site)
end