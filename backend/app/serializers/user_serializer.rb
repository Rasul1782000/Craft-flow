class UserSerializer
  include JSONAPI::Serializer

  attributes :id, :email, :first_name, :last_name, :phone, :full_name, :name_initials

  attribute :created_at do |user|
    user.created_at&.iso8601
  end
end