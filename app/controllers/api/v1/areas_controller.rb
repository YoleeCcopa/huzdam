class Api::V1::AreasController < Api::V1::BaseController
  before_action :set_area, only: [:show, :update, :destroy]

  # GET /api/v1/areas
  def index
    render_success(data: current_user.areas, message: "Areas loaded")
  end

  # GET /api/v1/areas/:id
  def show
    render_success(data: @area, message: "Area details")
  end

  # POST /api/v1/areas
  def create
    @area = current_user.areas.new(area_params)

    if @area.save
      render_success(data: @area, message: "Area created", status: :created)
    else
      render_error(message: "Area creation failed", errors: @area.errors.full_messages, fields: @area.errors.to_hash)
    end
  end

  # PATCH /api/v1/areas/:id
  def update
    return render_forbidden unless @area.editable_by?(current_user)

    if @area.update(area_params)
      render_success(data: @area, message: "Area updated")
    else
      render_error(message: "Area update failed", errors: @area.errors.full_messages, fields: @area.errors.to_hash)
    end
  end

  # DELETE /api/v1/areas/:id
  def destroy
    return render_forbidden unless @area.deletable_by?(current_user)

    @area.destroy
    render_success(message: "Area deleted", data: nil)
  end

  private

  def set_area
    @area = Area.find_by(id: params[:id])
    render_not_found("Area") unless @area
  end

  def area_params
    params.require(:area).permit(:name, :description)
  end
end
