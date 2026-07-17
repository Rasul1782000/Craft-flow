# Phone number normalization utility
class PhoneNumberNormalizer
  def initialize(phone)
    @phone = phone.to_s.strip
  end

  def normalize
    digits = @phone.gsub(/[^+\d]/, '')

    if digits.start_with?('1') && digits.length == 11
      "+#{digits}"
    elsif digits.length == 10
      "+1#{digits}"
    elsif digits.start_with?('+') && digits.length >= 10 && digits.length <= 15
      digits
    else
      @phone
    end
  end
end