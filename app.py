from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuring the SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///thumbnails.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models: Thumbnail Board and Thumbnail
class ThumbnailBoard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    thumbnails = db.relationship('Thumbnail', backref='board', lazy=True)

class Thumbnail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    channel_name = db.Column(db.String(100), nullable=False)
    views = db.Column(db.String(50))
    uploaded_ago = db.Column(db.String(50))
    board_id = db.Column(db.Integer, db.ForeignKey('thumbnail_board.id'), nullable=False)

# Create the database tables
with app.app_context():
    db.create_all()

# Route to serve the homepage (replace with your HTML template later)
@app.route('/')
def index():
    boards = ThumbnailBoard.query.all()
    return render_template('index.html', boards=boards)

# Route to add a new thumbnail board
@app.route('/add_board', methods=['POST'])
def add_board():
    board_name = request.json.get('board_name')  # Use JSON data
    new_board = ThumbnailBoard(name=board_name)
    db.session.add(new_board)
    db.session.commit()
    return jsonify({"message": "Board added successfully!", "board_id": new_board.id}), 200

# Route to add a thumbnail to a specific board
@app.route('/add_thumbnail', methods=['POST'])
def add_thumbnail():
    data = request.json  # Get JSON data
    video_id = data.get('video_id')
    title = data.get('title', 'New Video')
    channel_name = data.get('channel_name', 'New Channel')
    views = data.get('views', '0 views')
    uploaded_ago = data.get('uploaded_ago', 'Just now')
    board_id = data.get('board_id')

    # Construct the thumbnail URL
    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
    
    # Create a new thumbnail instance
    new_thumbnail = Thumbnail(
        video_id=video_id,
        title=title,
        channel_name=channel_name,
        views=views,
        uploaded_ago=uploaded_ago,
        board_id=board_id
    )
    
    # Add the thumbnail to the database
    db.session.add(new_thumbnail)
    db.session.commit()
    
    # Return a success response
    return jsonify({"message": "Thumbnail added successfully!", "thumbnail_url": thumbnail_url}), 200

# Route to get thumbnails for a specific board
@app.route('/get_thumbnails/<int:board_id>', methods=['GET'])
def get_thumbnails(board_id):
    thumbnails = Thumbnail.query.filter_by(board_id=board_id).all()
    thumbnails_list = [
        {
            "video_id": t.video_id,
            "title": t.title,
            "channel_name": t.channel_name,
            "views": t.views,
            "uploaded_ago": t.uploaded_ago
        }
        for t in thumbnails
    ]
    return jsonify(thumbnails_list), 200

# Route to delete a thumbnail by ID
@app.route('/delete_thumbnail/<int:thumbnail_id>', methods=['DELETE'])
def delete_thumbnail(thumbnail_id):
    thumbnail = Thumbnail.query.get(thumbnail_id)
    if thumbnail:
        db.session.delete(thumbnail)
        db.session.commit()
        return jsonify({"message": "Thumbnail deleted successfully!"}), 200
    return jsonify({"message": "Thumbnail not found!"}), 404

# Running the app
if __name__ == "__main__":
    app.run(debug=True)
