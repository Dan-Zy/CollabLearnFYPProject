import os
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import OneHotEncoder

class KnnUserRecommender:
    def __init__(self, path_train):
        self.path_train = path_train
        self.model = NearestNeighbors()
        self.encoder = OneHotEncoder(handle_unknown='ignore')  # Ignore unknown categories

    def set_model_params(self, n_neighbors, algorithm, metric, n_jobs=None):
        if n_jobs and (n_jobs > 1 or n_jobs == -1):
            os.environ['JOBLIB_TEMP_FOLDER'] = '/tmp'
        self.model.set_params(**{
            'n_neighbors': n_neighbors,
            'algorithm': algorithm,
            'metric': metric,
            'n_jobs': n_jobs})

    def _prep_data(self):
        df_train = pd.read_csv(self.path_train)

        if 'Name' in df_train.columns:
            df_train = df_train.drop(columns=['Name'])

        X_train = df_train[['Role', 'Degree', 'Subject', 'Interests']]
        y_train = df_train['UserId']

        X_train_encoded = self.encoder.fit_transform(X_train)

        X_train_sparse = csr_matrix(X_train_encoded)

        return X_train_sparse, y_train

    def _prep_test_sample(self, test_sample):
        test_df = pd.DataFrame([test_sample])
        X_test_encoded = self.encoder.transform(test_df)
        X_test_sparse = csr_matrix(X_test_encoded)
        return X_test_sparse

    def _inference(self, model, data_train, y_train, data_test, n_recommendations):
        model.fit(data_train)
        distances, indices = model.kneighbors(data_test, n_neighbors=n_recommendations)
        similar_users = y_train.iloc[indices.flatten()].tolist()
        return [similar_users]

    def recommend_users(self, test_sample, n_recommendations):
        X_train_sparse, y_train = self._prep_data()
        X_test_sparse = self._prep_test_sample(test_sample)
        recommendations = self._inference(self.model, X_train_sparse, y_train, X_test_sparse, n_recommendations)
        return recommendations, y_train

    def calculate_accuracy(self, y_train, recommendations, n_recommendations):
        correct_count = 0
        total_count = len(recommendations)
        for idx, recs in enumerate(recommendations):
            if y_train.iloc[idx] in recs[:n_recommendations]:
                correct_count += 1
        accuracy = correct_count / total_count
        return accuracy
