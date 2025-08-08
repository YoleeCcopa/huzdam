class Api::V1::ContainersController < Api::V1::BaseController
  load_and_authorize_resource

  # GET /api/v1/containers
  def index
    @containers = current_user.containers
    render json: @containers
  end

  # POST /api/v1/containers
  def create
    @container = current_user.containers.build(container_params)
    if @container.save
      render json: @container, status: :created
    else
      render json: { errors: @container.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/containers/:id
  def update
    if @container.update(container_params)
      render json: @container
    else
      render json: { errors: @container.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/containers/:id
  def destroy
    @container.destroy
    render json: { message: "Container deleted successfully" }, status: :ok
  end

  private

  def container_params
    params.require(:container).permit(:name, :description, :parent_type, :parent_id)
  end
end
