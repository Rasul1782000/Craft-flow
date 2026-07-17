class PropertySerializer
  include JSONAPI::Serializer

  attributes :id, :title, :description, :price, :address, :city, :state, :zip_code, :bedrooms, :bathrooms, :square_feet, :property_type, :status, :featured, :image_url, :agent_name, :agent_phone, :agent_email

  def price_display
    object.price_display
  end

  def full_address
    object.full_address
  end

  def property_type_display
    object.property_type_display
  end
end