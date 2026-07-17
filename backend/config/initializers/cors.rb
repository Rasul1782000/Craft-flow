Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins %w[
      http://localhost:4200
      http://localhost:4201
      http://127.0.0.1:4200
    ]

    resource "/api/*",
      headers: [ "Authorization", "Content-Type" ],
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      max_age: 86400
  end
end
