class ErrorFormatter
  def self.format(exception, controller_name = nil)
    case exception
    when ActiveRecord::RecordNotFound
      {
        error: 'Not Found',
        message: exception.message,
        details: controller_name ? "Resource not found in #{controller_name}" : nil
      }
    when ActiveRecord::RecordInvalid
      {
        error: 'Validation Error',
        message: 'Record could not be saved',
        details: exception.record.errors.full_messages
      }
    when ArgumentError
      {
        error: 'Bad Request',
        message: exception.message
      }
    when StandardError
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      }
    else
      {
        error: 'Unknown Error',
        message: exception.message
      }
    end
  end
end