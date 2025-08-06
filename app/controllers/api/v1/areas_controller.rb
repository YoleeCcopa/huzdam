class Api::V1::AreasController < Api::V1::BaseController
  before_action :authenticate_user!
  load_and_authorize_resource

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

  # PATCH /api/v1/areas/:id
  def update
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

  def area_params
    params.require(:area).permit(:name, :description)
  end
end
