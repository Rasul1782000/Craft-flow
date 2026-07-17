class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :first_name, presence: true, length: { maximum: 100 }
  validates :last_name, presence: true, length: { maximum: 100 }
  validates :phone, presence: true, length: { maximum: 20 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { in: 8..128 }, if: :password_required?
  validates :password, format: {
    with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+\z/,
    message: "must include at least one uppercase letter, one lowercase letter, one number, and one special character"
  }, if: :password_required?

  before_save :downcase_email

  def full_name
    "#{first_name} #{last_name}"
  end

  def name_initials
    "#{(first_name[0] || '')}#{(last_name[0] || '')}".upcase
  end

  private

  def password_required?
    new_record? || password.present?
  end

  def downcase_email
    self.email = email.downcase
  end
end
