class V1::ShiftsController < ApplicationController

  def index
    @shifts = params[:organization_id] ? Organization.find(params[:organization_id]).shifts : Shift.all
    if @shifts
      render json: @shifts, :status => :ok
    else
      render json: { errors: ['no shifts found'] }, :status => :unprocessable_entity
    end
  end

  def show
    @shift = Shift.find(params[:id])
    if @shift
      render json: @shift
    else
      render json: { errors: ['shift not found'] }, :status => :not_found
    end
  end

  def create
    @shift = Shift.create(shift_params)
    if @shift.save
      render json: @shift, :status => :created
    else 
      render json: { errors: @shift.errors.full_messages }, :status => :unprocessable_entity
    end
  end

  def update
    @shift = Shift.find(params[:id])
    if @shift.update(shift_params)
      render json: @shift, :status => :ok
    else 
      render json: { errors: @shift.errors.full_messages }, :status => :unprocessable_entity
    end
  end
  

  def destroy
    @shift = Shift.find(params[:id])
    if @shift.destroy
      render json: @shift, :status => :ok
    else 
      render json: { errors: @shift.errors.full_messages }, :status => :unprocessable_entity
    end
  end

  private

  def shift_params 
    params.require(:shift).permit(:start, :end, :user_id, :organization_id, :breaks_attributes => [:length])
  end
end
