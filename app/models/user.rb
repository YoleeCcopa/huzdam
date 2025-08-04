class User < ApplicationRecord
    # Important: The order of modules matters
    devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable,
        :confirmable 

    include DeviseTokenAuth::Concerns::User
end
