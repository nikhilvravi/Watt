from flask import Flask, render_template, jsonify, url_for

app = Flask(__name__)

@app.route("/")
@app.route("/index")
def hello():
    return render_template("index.html")

@app.route("/purchases/<my_id>")
def purchases(my_id):
    lst = []
    with app.open_resource('static/data/purchases.txt') as f:
        lines = f.readlines()
        for i in range(len(lines)):
            lines[i] = lines[i].split("\t")
            lst.append({
                    "user_id": my_id,
                    "date": lines[i][0],
                    "company": lines[i][1],
                    "category": lines[i][2],
                    "amount": int(lines[i][3])
                })
        return jsonify(user_purchases=lst)

@app.route("/deposits/<my_id>")
def deposits(my_id):
    lst = []
    with app.open_resource('static/data/deposits.txt') as f:
        lines = f.readlines()
        for i in range(len(lines)):
            lines[i] = lines[i].split("\t")
            lst.append({
                    "user_id": my_id,
                    "date": lines[i][0],
                    "amount": int(lines[i][1]),
                })
        return jsonify(user_deposits=lst)

if __name__ == "__main__":
    app.run(debug=True)
