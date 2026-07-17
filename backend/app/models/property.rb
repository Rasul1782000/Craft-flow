class Property < ApplicationRecord
  validates :title, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :address, presence: true
  validates :bedrooms, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :bathrooms, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :square_feet, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, inclusion: { in: %w[for_sale for_rent pending] }
  validates :featured, inclusion: { in: [true, false] }

  scope :featured, -> { where(featured: true) }
  scope :for_sale, -> { where(status: 'for_sale') }
  scope :for_rent, -> { where(status: 'for_rent') }

  def price_display
    "$#{price.to_s.reverse.gsub(/\d{3}/, '\\&,').reverse}"
  end

  def full_address
    "#{address}, #{city}, #{state} #{zip_code}"
  end

  def property_type_display
    property_type.titleize
  end
end