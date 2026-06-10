from flask import Flask, render_template

app = Flask(__name__, 
            template_folder='templates',
            static_folder='static')

@app.route('/')
def main():
    return render_template('main.html', active_page='main')

@app.route('/player')
def player():
    return render_template('player.html', active_page='player')

@app.route('/calculator')
def calculator():
    return render_template('calculator.html', active_page='calculator')

@app.route('/meta_decks')
def meta_decks():
    return render_template('Meta_decks.html', active_page='meta_decks')

@app.route('/news')
def news():
    return render_template('news.html', active_page='news')

if __name__ == '__main__':
    app.run(debug=True)