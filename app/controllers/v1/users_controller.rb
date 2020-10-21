class V1::UsersController < ApplicationController
  skip_before_action :authenticate_user, only: [:create]

  def index
      @users = User.all
      if @users
        render json: { users: @users }
      else
        render json: { errors: ['no users found'] }, :status => :not_found
      end
  end

  def show
    @user = User.find(params[:id])
    if @user
      render json: { user: @user }
    else
      render json: { errors: ['user not found'] }, :status => :not_found
    end
  end

  def update
    puts @current_user
    @user = User.find(params[:id])
    if @user.update(user_params)
      render json: { user: @user }
    else
      render json: { errors: @user.errors.full_messages }, :status => :unprocessable_entity
    end
  end
    
  def create
    @user = User.new(user_params)
    if @user.save
      render json: { user: @user }, :status => :created
    else 
      render json: { errors: @user.errors.full_messages }, :status => :unprocessable_entity
    end
  end
  private
    
  def user_params
    params.require(:user).permit(:name, :email_address, :password, :password_digest, :password_confirmation)
  end
end
  