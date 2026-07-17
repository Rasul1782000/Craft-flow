class ApplicationController < ActionController::API
  include JsonRespondable

  private

  def token_for(user)
    verifier.generate({ sub: user.id, exp: 24.hours.from_now.to_i })
  end

  def verifier
    ActiveSupport::MessageVerifier.new(Rails.application.secret_key_base)
  end

  def current_user
    @current_user ||= authenticate_token
  end

  def authenticate_token
    header = request.headers["Authorization"]
    return nil unless header&.start_with?("Bearer ")

    token = header.split(" ").last
    payload = verifier.verify(token)
    User.find_by(id: payload["sub"])
  rescue ActiveSupport::MessageVerifier::InvalidSignature,
         ActiveSupport::MessageVerifier::InvalidTimestamp
    nil
  end

  def require_auth
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user
  end
end
