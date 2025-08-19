require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  setup do
    User.create!(
      email: "test@example.com",
      password: "password123",
      user_name: "test",
      uid: SecureRandom.uuid,
      provider: "email"
    )
  end

  test "should get index" do
    get root_url
    assert_response :success
  end
end
