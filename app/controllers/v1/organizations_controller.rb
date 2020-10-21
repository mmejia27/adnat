class V1::OrganizationsController < ApplicationController

  def index
    @organizations = params[:user_id] ? User.find(params[:user_id]).organizations : Organization.all
    if @organizations
      render json: { organizations: @organizations }, :status => :ok
    else
      render json: { errors: ['no organizations found'] }, :status => :unprocessable_entity
    end
  end

  def show
    @organization = Organization.find(params[:id])
    if @organization
      render json: { organization: @organization }
    else
      render json: { errors: ['organization not found'] }, :status => :not_found
    end
  end

  def create
    @organization = Organization.new(organization_params)
    if @organization.save
      render json: { organization: @organization }, :status => :created
    else 
      render json: { errors: @organization.errors.full_messages }, :status => :unprocessable_entity
    end
  end

  def update
    @organization = Organization.find(params[:id])
    if @organization.update(organization_params)
      render json: { organization: @organization }, :status => :ok
    else 
      render json: { errors: @organization.errors.full_messages }, :status => :unprocessable_entity
    end
  end
  

  def destroy
    @organization = Organization.find(params[:id])
    if @organization.destroy
      render json: { organization: @organization }, :status => :ok
    else 
      render json: { errors: @organization.errors.full_messages }, :status => :unprocessable_entity
    end
  end

  def join
    @organization = Organization.find(params[:id])
    @user = User.find(params[:user_id])
    @organization.users << @user
  end

  def leave
    @organization = Organization.find(params[:id])
    @user = User.find(params[:user_id])
    @organization.users.delete @user
  end

  private

  def organization_params 
    params.require(:organization).permit(:name, :hourly_rate)
  end
end
