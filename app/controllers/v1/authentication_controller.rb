module V1
  class AuthenticationController < ApplicationController
    skip_before_action :authenticate_user
    
    def create
      token_command = AuthenticateUserCommand.call(authentication_params[:email_address], authentication_params[:password])


      if token_command.success?
        render json: { token: token_command.result[:token], user: token_command.result[:user] }
      else
        render json: { error: token_command.errors }, status: :unauthorized
      end
    end

    private

    def authentication_params 
      params.require(:user).permit(:email_address, :password)
    end
  end
end
