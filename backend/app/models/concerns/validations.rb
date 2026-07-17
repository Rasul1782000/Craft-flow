module Concerns
  module Models
    module Validations
      extend ActiveSupport::Concern

      included do
        before_validation :normalize_fields

        private

        def normalize_fields
          self.title = title.titleize if defined?(title)
          self.first_name = first_name.titleize if defined?(first_name)
          self.last_name = last_name.titleize if defined?(last_name)
          self.email = email.downcase.strip if defined?(email)
          self.phone = PhoneNumberNormalizer.new(phone).normalize if defined?(phone)
        end
      end
    end
  end
end