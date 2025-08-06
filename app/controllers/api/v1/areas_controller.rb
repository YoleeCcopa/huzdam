class Api::V1::AreasController < ApplicationController
  before_action :authenticate_user!          # Devise Token Auth
  load_and_authorize_resource                # CanCanCan: ensures user can access the area

  # GET /api/v1/areas
  def index
    @areas = current_user.areas
    render json: @areas
  end

  # POST /api/v1/areas
  def create
    @area = current_user.areas.build(area_params)
    if @area.save
      render json: @area, status: :created
    else
      render json: { errors: @area.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/areas/:id
  def update
    # Only update fields that are present in the request
    if @area.update(area_params)
      render json: @area
    else
      render json: { errors: @area.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/areas/:id
  def destroy
    @area.destroy
    render json: { message: "Area deleted successfully" }, status: :ok
  end

  private

  # Permit only the fields users are allowed to update
  def area_params
    params.require(:area).permit(:name, :description)
  end
end
