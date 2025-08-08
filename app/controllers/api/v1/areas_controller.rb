class Api::V1::AreasController < Api::V1::BaseController
  before_action :set_area, only: [:show, :update, :destroy]
  # load_and_authorize_resource

  # GET /api/v1/areas
  def index
    @areas = current_user.areas
    render json: @areas
  end

  # GET /api/v1/areas/:id
  def show
    render json: @area
  end

  # POST /api/v1/areas
  def create
    @area = Area.new(area_params)
    @area.user = current_user
    Rails.logger.debug("Current user: #{@area.user.inspect}")  # Log user for debugging

    if @area.save
      render json: @area, status: :created
    else
      Rails.logger.error "Area creation failed: #{@area.errors.full_messages.join(', ')}"
      render json: @area.errors, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/areas/:id
  def update
    unless @area.editable_by?(current_user)
      render json: { error: 'You are not authorized to edit this area' }, status: :forbidden
      return
    end

    if @area.update(area_params)
      render json: @area, status: :ok
    else
      render json: @area.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/areas/:id
  def destroy
    unless @area.deletable_by?(current_user)
      render json: { error: 'You are not authorized to delete this area' }, status: :forbidden
      return
    end

    @area.destroy
    head :no_content
  end

  private

  def set_area
    @area = Area.find(params[:id])
  end

  def area_params
    params.require(:area).permit(:name, :description)
  end
end
