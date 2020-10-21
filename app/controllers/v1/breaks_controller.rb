class V1::BreaksController < ApplicationController

  def index
    @breaks = params[:Break_id] ? Breaks.find(params[:Break_id]).breaks : Break.all
    if @breaks
      render json: @breaks, :status => :ok
    else
      render json: { errors: ['no breaks found'] }, :status => :unprocessable_entity
    end
  end

  def show
    @break = Break.find(params[:id])
    if @break
      render json: @break
    else
      render json: { errors: ['break not found'] }, :status => :not_found
    end
  end

  def create
    @break = Break.new(break_params)
    if @break.save
      render json: @break, :status => :created
    else 
      render json: { errors: @break.errors.full_messages }, :status => :unprocessable_entity
    end
  end

  def update
    @break = Break.find(params[:id])
    if @break.update(Break_params)
      render json: @break, :status => :ok
    else 
      render json: { errors: @break.errors.full_messages }, :status => :unprocessable_entity
    end
  end
  

  def destroy
    @break = Break.find(params[:id])
    if @break.destroy
      render json: @break, :status => :ok
    else 
      render json: { errors: @break.errors.full_messages }, :status => :unprocessable_entity
    end
  end

  private

  def break_params 
    params.require(:break).permit(:length, :shift_id)
  end
end
