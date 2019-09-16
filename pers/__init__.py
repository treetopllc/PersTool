import os
from waitress import serve

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from flask_api import status

import numpy as np
import pandas
import logging

app = Flask(__name__)
CORS(app)

def raisethemoney(sual, tax, RR, year, inflation):
	sual_list= [sual]
	tax_list = [tax]
	while sual > 0:
		sual = (sual - tax) * (RR + inflation - 1)
		if year >= 2120:
			print("Tax too low")
			break
		tax = tax * inflation
		year = year + 1
		sual_list.append(sual)
		tax_list.append(tax)
	return np.asarray(sual_list), np.asarray(tax_list), year

def get_normal_cost(month, year):
	#initial normal cost and contribution rate %s
	nc = 0.452380952380952
	date = (year, month)

	if (2021, 5) < date <= (2023, 5):
		nc = 0.362179487179487
	elif (2023, 5) < date <= (2025, 5):
		nc = 0.339449541284404
	elif (2025, 5) < date <= (2027, 5):
		nc = 0.328313253012048
	elif (2027, 5) < date <= (2029, 5):
		nc = 0.326219512195122
	elif (2029, 5) < date <= (2031, 5):
		nc = 0.322085889570552
	elif (2031, 5) < date <= (2033, 5):
		nc = 0.317901234567901
	elif (2033, 5) < date <= (2035, 5):
		nc = 0.320634920634921
	elif (2035, 5) < date:
		nc = 0.41338582677165
	return nc


def get_contribution_rate(month, year):
	#initial normal cost and contribution rate %s
	cr = .252
	date = (year, month)

	if (2021, 5) < date <= (2023, 5):
		cr = 0.3045
	elif (2023, 5) < date <= (2025, 5):
		cr = 0.311
	elif (2025, 5) < date <= (2027, 5):
		cr = 0.31
	elif (2027, 5) < date <= (2029, 5):
		cr = 0.30275
	elif (2029, 5) < date <= (2031, 5):
		cr = 0.29625
	elif (2031, 5) < date <= (2033, 5):
		cr = 0.28925
	elif (2033, 5) < date <= (2035, 5):
		cr = 0.27575
	elif (2035, 5) < date:
		cr = 0.214
	return cr


def get_contributions(month, year):
	date = (year, month)
	if date <= (2021, 5):
		base_contribution = 224.017455
		start_date = (2019, 6)
	elif (2021, 5) < date <= (2023, 5):
		base_contribution = 283.429723820612
		start_date = (2021, 6)
	elif (2023, 5) < date <= (2025, 5):
		base_contribution = 310.098157092997
		start_date = (2023, 6)
	elif (2025, 5) < date <= (2027, 5):
		base_contribution = 331.116779687792
		start_date = (2025, 6)
	elif (2027, 5) < date <= (2029, 5):
		base_contribution = 346.405155710321
		start_date = (2027, 6)
	elif (2029, 5) < date <= (2031, 5):
		base_contribution = 363.110873300627
		start_date = (2029, 6)
	elif (2031, 5) < date <= (2033, 5):
		base_contribution = 379.782511524003
		start_date = (2031, 6)
	elif (2033, 5) < date <= (2035, 5):
		base_contribution = 387.844659084487
		start_date = (2033, 6)
	elif (2035, 5) < date:
		base_contribution = 322.430982826999
		start_date = (2035, 6)
	num_months = (date[0] - start_date[0]) * 12 + (date[1] - start_date[1])
	return base_contribution * 1.00287089871908 ** num_months

def calculate_normal_cost(month, year):
	nc = get_normal_cost(month, year)
	calculated_contribution = get_contributions(month, year)
	return nc * calculated_contribution


def get_monthly_payroll(month, year, current, monthly_payroll_growthrate):
	if year == 2021 and month == 5:
		monthly_payroll = 930.803690708086
	elif year == 2042 and month == 10:
		monthly_payroll = 1939.03460093616
	else:
		monthly_payroll = current * monthly_payroll_growthrate
	return monthly_payroll


#Amortization period
def calculate_amortization(amperiod, ual, sual, RR, payroll_growthrate, month_val, year, payroll_total, ual_growth):
	pay2019 = 1302.71
	data = []
	ual_growth_monthly = ual_growth ** (1/12)
	paid = False
	sual_list= [sual]

	#monthly rates
	ual_growth_monthly = RRinf_monthly = ual_growth ** (1/12)
	monthly_payroll_growthrate = payroll_growthrate ** (1/12)
	RR_monthly_actual = RR ** (1/12)

	#initial values
	#discount takes out interest rate over the full period of time
	discount = (1 - (monthly_payroll_growthrate / RRinf_monthly) ** (amperiod * 12)) / (RRinf_monthly - monthly_payroll_growthrate)
	ual_pay_monthly = ual / discount
	month = 1
	actual_fund_growth = needed_fund_growth = needed_fund_growth_init = ual_pay_monthly_init = ual_pay_monthly
	ual_growth = ual * RRinf_monthly
	monthly_payroll = payroll_total[year] / month_val

	while amperiod > 0:
		if year >= 2120:
			break
		if ual <= 0 and sual != 0 and (sual_list[year-2020] < 0):
			break

        #monthly breakdowns
		payroll = 0
		pay = 0
		normal_cost_annual = 0
		for i in range(0, 12):
			calculated_normal_cost = calculate_normal_cost(i, year)
			ual = ual_growth - actual_fund_growth

			#accumulate the yearly totals
			payroll += monthly_payroll
			pay += ual_pay_monthly
			normal_cost_annual += calculated_normal_cost

			#now update the values for each month
			ual_pay_monthly = ual_pay_monthly_init * monthly_payroll_growthrate ** month + ((needed_fund_growth * RRinf_monthly) - (actual_fund_growth * RR_monthly_actual))
			actual_fund_growth = actual_fund_growth * RR_monthly_actual + ual_pay_monthly
			needed_fund_growth = needed_fund_growth * RRinf_monthly + (needed_fund_growth_init * monthly_payroll_growthrate ** month)
			ual_growth = ual_growth * RRinf_monthly
			monthly_payroll = get_monthly_payroll(i, year, monthly_payroll, monthly_payroll_growthrate)
			month += 1

			if ual <= 0:
				paid = True


		#calculate and append annual totals
		contribution_rate = (pay + normal_cost_annual) / payroll
		data.append([pay, ual, contribution_rate, normal_cost_annual])
		year = year + 1
		amperiod = amperiod - 1
	return data, year, paid


#contribution rate as a portion of payroll
def calculate_contribution_rate(contribution_rate, ual, sual, RR, year, payroll_total, month_val, payroll_growthrate, ual_growth):
	pay2019 = 1451.26973004236
	data = []
	sual_list= [sual]

	#monthly growth rates
	ual_growth_monthly = RRinf_monthly = ual_growth ** (1/12)
	monthly_payroll_growthrate = payroll_growthrate ** (1/12)
	RR_monthly_actual = RR ** (1/12)

	#initial values
	monthly_payroll = payroll_total[2020] / month_val
	month = 0
	paid = False

	while ual > 0:
		if year >= 2120:
			break
		if ual <= 0 and sual != 0 and (sual_list[year-2020] < 0):
			break

		pay = 0
		contribution = 0
		normal_cost_annual = 0
		for i in range(0, 12):
			if ual <= 0:
				paid = True

			monthly_contribution = monthly_payroll * contribution_rate
			calculated_normal_cost = calculate_normal_cost(i, year)
			ual_pay_monthly = monthly_contribution - calculated_normal_cost

			if year == 2020 and i == 0:
				actual_fund_growth = ual_pay_monthly
				ual_growth = ual * RRinf_monthly
			else:
				actual_fund_growth = actual_fund_growth * RR_monthly_actual + ual_pay_monthly
				ual_growth = ual_growth * RRinf_monthly
			ual = ual_growth - actual_fund_growth

			#accumulate annual totals
			pay += ual_pay_monthly
			contribution += monthly_contribution
			normal_cost_annual += calculated_normal_cost

			#update monthly values
			monthly_payroll = get_monthly_payroll(i, year, monthly_payroll, monthly_payroll_growthrate)
			month += 1

		data.append([pay, ual, contribution_rate, normal_cost_annual])
		year = year + 1

	return data, year, paid


#contribution as a flat rate (plus inflation)
def calculate_contribution(contribution, ual, sual, RR, inflation, year, payroll_total, month_val, payroll_growthrate, ual_growth):
	year = 2020
	pay2019 = 1451.26973004236
	data = []
	sual_list= [sual]

	#monthly growthrates
	ual_growth_monthly = RRinf_monthly = ual_growth ** (1/12)
	monthly_payroll_growthrate = payroll_growthrate ** (1/12)
	RR_monthly_actual = RR ** (1/12)
	inflation_monthly = inflation ** (1/12)

	#initial values
	monthly_payroll = payroll_total[year] / month_val
	ual_growth = ual
	month = 0
	monthly_contribution = contribution / month_val
	paid = False

	while ual > 0:
		if year >= 2120:
			break
		if ual <= 0 and sual != 0 and (sual_list[year-2020] < 0):
			break

		pay = 0
		contribution = 0
		normal_cost_annual = 0
		payroll = 0
		for i in range(0, 12):
			if ual <= 0:
				paid = True

			calculated_normal_cost = calculate_normal_cost(i, year)
			ual_pay_monthly = monthly_contribution - calculated_normal_cost
			ual_growth = ual_growth * RRinf_monthly
			if year == 2020 and i == 0:
				actual_fund_growth = ual_pay_monthly
			else:
				actual_fund_growth = actual_fund_growth * RR_monthly_actual + ual_pay_monthly
			ual = ual_growth - actual_fund_growth

			#accumulate yearly totals
			pay += ual_pay_monthly
			contribution += monthly_contribution
			normal_cost_annual += calculated_normal_cost
			payroll += monthly_payroll

			#update monthly values
			monthly_contribution = monthly_contribution * inflation_monthly
			monthly_payroll = get_monthly_payroll(i, year, monthly_payroll, monthly_payroll_growthrate)
			month += 1

		#calculate and append annual totals
		contribution_rate = (pay + normal_cost_annual) / payroll
		data.append([pay, ual, contribution_rate, normal_cost_annual])
		year = year + 1

	return data, year, paid

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
    )

    @app.route('/api', methods=["OPTIONS", "POST"])
    @cross_origin()
    def create_api():
        if request.method == "OPTIONS": # CORS preflight
            return _build_cors_prelight_response()
        elif request.method == "POST": # The actual request following the preflight
            return _corsify_actual_response(jsonify(post()))
        else:
            raise RuntimeError("Weird - don't know how to handle method {}".format(request.method))
    def _build_cors_prelight_response():
    	response = make_response()
    	response.headers.add("Access-Control-Allow-Origin", "*")
    	response.headers.add("Access-Control-Allow-Headers", "*")
    	response.headers.add("Access-Control-Allow-Methods", "*")
    	return response
    def _corsify_actual_response(response):
        return response

    def post():
    	normal_cost = 1218.21911645892

    	req = request.json.get("data")
    	question = int(req.get("question"))
    	if question == 1:
    		amperiod = float(req.get("amperiod"))
    	if question == 3:
    		pay = float(req.get("pay"))
    		if pay < normal_cost:
    			return "Pay Too Low"
    	if question == 2:
    		contribution_rate = float(req.get('contribution_rate'))
    	ual = int(req.get('ual'))
    	sual = int(req.get('sual'))
    	RR = float(req.get('RR'))
    	inflation = float(req.get('inflation'))
    	tax = float(req.get('tax'))

    	if sual != 0:
    		ual = ual - sual

    	payroll_total = {
			2020: 11025.585615,
			2021: 11347.711070,
			2022: 11810.882950,
			2023: 12155.951791,
			2024: 12652.113088,
			2025: 13021.759457,
			2026: 13553.259843,
			2027: 13949.234274,
			2028: 14518.590775,
			2029: 14942.768486,
			2030: 15552.677403,
			2031: 16007.067171,
			2032: 16660.416851,
			2033: 17147.170530,
			2034: 17847.055042,
			2035: 18368.477751,
			2036: 19118.211537
			}

		# pension obligation fund debt service
    	pob = (
			573.4343585,
			596.8398425,
			605.7471839,
			630.4715587,
			647.8775716,
			674.3215541,
			676.224210,
			703.8251982,
			744.2061759,
			774.5819382,
			326.541601,
			339.8698296,
			199.5221645,
			20.76659263,
			13.14852491,
			13.6851994,
			6.706822572,
			6.980570433
			)

    	normal_cost = 1218.21911645892
		# read in historical data
    	hist_data = pandas.read_csv('historical.csv')
    	normalcost_hist = hist_data.NormalCost.tolist()
    	pay_hist = hist_data.Pay.tolist()
    	UALpayment_hist = hist_data.UALpayment.tolist()
    	POB_hist = hist_data.POB.tolist()
    	UAL_hist = hist_data.UAL.tolist()
    	year = 2020

    	data = []
    	resp = []

		# some constant monthly growthrates, we assume 3.5% per year for these
    	payroll_growthrate = 1.035
    	monthly_payroll_growthrate = 1.035 ** (1/12)
		# UAL should continue to grow at a constant rate regardless of inflation and/or RR
    	ual_growth = 1.072
		# this is the "value" of the number of months in a year accounting for payroll growthrate. weird, I know.
    	month_val =  1
    	month_interest = 1
    	for i in range(0, 11):
    		month_interest *= monthly_payroll_growthrate
    		month_val += month_interest

    	if question == 1:
    		data, end_year, paid = calculate_amortization(amperiod, ual, sual, RR, payroll_growthrate, month_val, year, payroll_total, ual_growth)
    	elif question == 2:
    		data, end_year, paid = calculate_contribution_rate(contribution_rate, ual, sual, RR, year, payroll_total, month_val, payroll_growthrate, ual_growth)
    	elif question == 3:
    		data, end_year, paid = calculate_contribution(pay, ual, sual, RR, inflation, year, payroll_total, month_val, payroll_growthrate, ual_growth)

    	if paid == False or end_year >= 2060:
    		return False

    	sual_list, tax_list, sualend_year = raisethemoney(sual, tax, RR, end_year, inflation)
    	data = np.asarray(data)


		#force them in
    	if sual_list.shape[0] > data.shape[0]:
    		data = np.pad(data, ((0,sual_list.shape[0] - data.shape[0]),(0,0)), 'constant')
    	elif sual_list.shape[0] < data.shape[0]:
    		sual_list = np.pad(sual_list, (0, data.shape[0]-sual_list.shape[0]), 'constant')
    		tax_list = np.pad(tax_list, (0, data.shape[0]-tax_list.shape[0]), 'constant')

    	data=np.insert(data, 3, sual_list, axis = 1)
    	data=np.insert(data, 4, tax_list, axis = 1)

    	if data.shape[0] < 15:
    		data = np.pad(data, ((0, 15 -  data.shape[0]),(0,0)), 'constant')

    	end_year = 2019+data.shape[0]
    	time_range = range(2020, end_year+1)

    	ual_response = list(data[:,1])
    	sual_response = list(data[:,3])
    	nc_response = list(data[:,5])
    	pay_response = list(data[:,0]-data[:,5])
    	tax_response = list(data[:,4])
    	pob_response = pob[3:]

    	i = 0

		# add error handling
    	while i < len(time_range):
    		respobj = {
				"year" : time_range[i],
				"ual" : ual_response[i],
				"sual" : sual_response[i],
				"normal_cost": nc_response[i],
				"payment" : pay_response[i],
				"tax": tax_response[i],
				"end_year": end_year,
				}
    		if time_range[i] < 2035:
    			respobj["pob"] = pob_response[i]
    		resp.append(respobj)
    		i += 1

    	return resp

    return app

# if __name__ == "__main__":
# 	from os import environ
# 	serve(app, host='0.0.0.0', port=environ.get("PORT", 5000), url_scheme='https')