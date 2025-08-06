class Item < ApplicationRecord
  belongs_to :container

  delegate :shelf, to: :container
end
