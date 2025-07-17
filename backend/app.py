import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

# Suppress TensorFlow logging messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' 
import tensorflow as tf


# --- 1. Initialize Flask App and CORS ---
# This allows our React frontend to communicate with this server
app = Flask(__name__)
CORS(app)


# --- 2. Load the Trained Keras Model ---
# Make sure the 'model.keras' file is in the same directory as this script.
try:
    model = tf.keras.models.load_model('model.keras')
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None


# --- 3. Define Class Names ---
# IMPORTANT: You MUST update this list to match the order of your model's output classes.
# The index of the sign name corresponds to the output neuron of your model.
# For example, if your model predicts '0' for a 20km/h speed limit, 
# 'Speed limit (20km/h)' should be the first item.
class_names = [
    'Speed limit (20km/h)', 'Speed limit (30km/h)', 'Speed limit (50km/h)', 
    'Speed limit (60km/h)', 'Speed limit (70km/h)', 'Speed limit (80km/h)', 
    'End of speed limit (80km/h)', 'Speed limit (100km/h)', 'Speed limit (120km/h)', 
    'No passing', 'No passing for vehicles over 3.5 tons', 'Right-of-way at the next intersection', 
    'Priority road', 'Yield', 'Stop', 'No vehicles', 
    'Vehicles over 3.5 tons prohibited', 'No entry', 'General caution', 
    'Dangerous curve to the left', 'Dangerous curve to the right', 'Double curve', 
    'Bumpy road', 'Slippery road', 'Road narrows on the right', 'Road work', 
    'Traffic signals', 'Pedestrians', 'Children crossing', 'Bicycles crossing', 
    'Beware of ice/snow', 'Wild animals crossing', 'End of all speed and passing limits', 
    'Turn right ahead', 'Turn left ahead', 'Ahead only', 'Go straight or right', 
    'Go straight or left', 'Keep right', 'Keep left', 'Roundabout mandatory', 
    'End of no passing', 'End of no passing by vehicles over 3.5 tons'
]


# --- 4. Image Preprocessing Function ---
def preprocess_image(image_file):
    """
    Loads an image file, resizes it to the model's expected input size,
    and normalizes the pixel values.
    """
    # The model expects 32x32 pixel images
    img = Image.open(io.BytesIO(image_file.read())).convert('RGB')
    img = img.resize((32, 32))
    
    # Convert image to numpy array and normalize
    img_array = np.array(img) / 255.0
    
    # Add a batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


# --- 5. Create the Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    """
    Handles the image upload and returns the model's prediction.
    """
    if model is None:
        return jsonify({'error': 'Model is not loaded. Please check server logs.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file:
        try:
            # Preprocess the image
            processed_image = preprocess_image(file)

            # Get model prediction
            predictions = model.predict(processed_image)
            
            # Get the class with the highest probability
            predicted_class_index = np.argmax(predictions[0])
            confidence = float(np.max(predictions[0]))
            
            # Get the corresponding class name
            sign_name = class_names[predicted_class_index]

            # Return the result as JSON
            return jsonify({
                'signName': sign_name,
                'confidence': confidence
            })

        except Exception as e:
            print(f"Prediction error: {e}")
            return jsonify({'error': 'Error processing the image.'}), 500
            
    return jsonify({'error': 'An unknown error occurred'}), 500


# --- 6. Run the Flask App ---
if __name__ == '__main__':
    # Use 0.0.0.0 to make the app accessible on your network
    # The React app will send requests to this server.
    app.run(host='0.0.0.0', port=5000, debug=True)

