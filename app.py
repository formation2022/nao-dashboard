from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np

app = Flask(__name__)

data_df = pd.read_csv("static/data/churn_data.csv")
churn_df = data_df[(data_df['Churn']=="Yes").notnull()]

@app.route('/')
def index():
    return render_template('index.html')

def calculate_percentage(val, total):
    """Calculates the percentage of a value over a total"""
    percent = np.round((np.divide(val, total) * 100), 2)
    return percent

def data_creation(percent, class_labels, group=None):
    data = []
    for index, item in enumerate(percent):
        data_instance = {}
        data_instance['category'] = class_labels[index]
        data_instance['value'] = item
        data_instance['group'] = group
        data.append(data_instance)

    return data

@app.route('/get_piechart_data')
def get_piechart_data():
    contract_labels = ['Month-to-month', 'One year', 'Two year']
    contract_values = churn_df.groupby('Contract').size().values
    class_percent = calculate_percentage(contract_values, np.sum(contract_values))

    piechart_data = data_creation(class_percent, contract_labels)

    return jsonify(piechart_data)

@app.route('/get_barchart_data')
def get_barchart_data():
    tenure_labels = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79']
    churn_df['tenure_group'] = pd.cut(churn_df.tenure, range(0, 81, 10), labels=tenure_labels)
    select_df = churn_df[['tenure_group','Contract']]
    contract_month = select_df[select_df['Contract']=='Month-to-month']
    contract_one = select_df[select_df['Contract']=='One year']
    contract_two =  select_df[select_df['Contract']=='Two year']
    month_values = contract_month.groupby('tenure_group').size().values
    month_percent = calculate_percentage(month_values, np.sum(month_values))
    one_values = contract_one.groupby('tenure_group').size().values
    one_percent = calculate_percentage(one_values, np.sum(one_values))
    two_values = contract_two.groupby('tenure_group').size().values
    two_percent = calculate_percentage(two_values, np.sum(two_values))
    all_values = select_df.groupby('tenure_group').size().values
    all_percent = calculate_percentage(all_values, np.sum(all_values))

    barchart_data = data_creation(all_percent, tenure_labels, "All")
    barchart_data += data_creation(month_percent, tenure_labels, "Month-to-month")
    barchart_data += data_creation(one_percent, tenure_labels, "One year")
    barchart_data += data_creation(two_percent, tenure_labels, "Two year")

    return jsonify(barchart_data)

if __name__ == '__main__':
    app.run(debug=True)