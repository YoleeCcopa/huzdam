# app/services/resolve_polymorphic_parent.rb
class ResolvePolymorphicParent
  class Configuration
    attr_accessor :allowed_types

    def initialize
      @allowed_types = %w[Area Container Shelf]
    end
  end

  def self.config
    @config ||= Configuration.new
  end

  def self.configure
    yield(config)
  end

  def self.call(type:, id:, allowed_types: nil)
    new(type: type, id: id, allowed_types: allowed_types).call
  end

  attr_reader :type, :id, :allowed_types, :parent, :error

  def initialize(type:, id:, allowed_types: nil)
    @type = type
    @id = id
    @allowed_types = allowed_types || self.class.config.allowed_types
    @parent = nil
    @error = nil
  end

  def call # Handle errors manually.
    return self unless valid_type?

    begin
      @parent = type.constantize.find(id)
    rescue ActiveRecord::RecordNotFound
      @error = "#{type} with ID #{id} not found"
    end

    self
  end

  def call! # Handle exceptions.
    call
    raise StandardError, error unless success?
    self
  end

  def success?
    error.nil?
  end

  private

  def valid_type?
    if allowed_types.include?(type)
      true
    else
      @error = "Invalid parent type: #{type}"
      false
    end
  end
end
