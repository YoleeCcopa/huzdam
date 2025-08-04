require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(
      email: "test@example.com",
      password: "password123",
      uid: SecureRandom.uuid,
      provider: "email"
    )
  end

  test "should get index" do
    get root_url
    assert_response :success
  end
end