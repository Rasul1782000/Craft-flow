module JsonRespondable
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  end

  private

  def json_response(object, status = :ok)
    render json: object, status: status
  end

  def record_not_found(exception)
    json_response({ error: exception.message }, :not_found)
  end

  def record_invalid(exception)
    json_response({ errors: exception.record.errors.full_messages }, :unprocessable_entity)
  end
end