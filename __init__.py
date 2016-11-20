from flask import Flask, render_template, jsonify, url_for

app = Flask(__name__)

@app.route("/")
@app.route("/index")
def hello():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)