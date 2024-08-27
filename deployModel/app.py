from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender.knn_user_recommender import KnnUserRecommender

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

recommender = KnnUserRecommender('./recommender/my_dataset.csv')
recommender.set_model_params(20, 'brute', 'cosine', -1)

@app.route('/recommend', methods=['POST'])
def recommend():
    # Parse input from the POST request
    n_recommendations = int(request.form.get('n_recommendations', 4))
    role = request.form.get('Role')
    degree = request.form.get('Degree')
    subject = request.form.get('Subject')
    interests = request.form.getlist('Interests')

    # Join the interests list into a single string
    interests_str = ', '.join(interests)

    # Prepare a test sample based on input
    test_sample = {
        "Role": role,
        "Degree": degree,
        "Subject": subject,
        "Interests": interests_str  # Store interests as a single string
    }

    # Get recommendations
    recommended_users, y_train = recommender.recommend_users(test_sample, n_recommendations)
    accuracy = recommender.calculate_accuracy(y_train, recommended_users, n_recommendations)

    # Prepare the response
    recommendations = [{"test_sample": 1, "users": users} for users in recommended_users]
    response = {
        "recommendations": recommendations,
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
