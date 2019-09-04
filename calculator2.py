#!/usr/bin/env python3

import numpy as np
import matplotlib.pyplot as plt
import pandas
import sys

def raisethemoney(sual, tax, RR, year, inflation):
	sual_list= [sual]
	tax_list = [tax]
	while sual > 0:
		sual = (sual - tax) * (RR + inflation-1)
		if year >= 2120:
			print("Tax too low")
			break
		tax = tax * inflation
		year = year + 1
		sual_list.append(sual)
		tax_list.append(tax)
	return np.asarray(sual_list), np.asarray(tax_list), year


def plotstuff(data, UAL_hist, normalcost_hist, UALpayment_hist, POB_hist, pob):
	#plot the historical stuff
	hist_time = list(range(2003,2020))
	plt.bar(hist_time, UAL_hist, color ='#E5E8E8', label = '_UAL')
	plt.bar(hist_time, normalcost_hist, color = 'green', label= '_Normal Cost')
	plt.bar(hist_time, UALpayment_hist, bottom = normalcost_hist, color = 'red', label = '_UAL payment')
	plt.bar(hist_time, POB_hist, bottom = [sum(pair) for pair in zip(UALpayment_hist, normalcost_hist)], color = 'MediumPurple', label='_POB')
	###plot the predictions
	end_year = 2019+data.shape[0]
	time_range = range(2020, end_year+1)
	plt.bar(list(time_range), list(data[:,1]), color = '#E5E8E8', label='UAL') #ual
	plt.bar(list(time_range), list(data[:,3]),bottom = list(data[:,1]), color = '#B2BABB', label='SUAL') #sual
	plt.bar(list(time_range), list(data[:,5]), color = 'green', label='Normal Cost') #normal cost
	plt.bar(list(time_range), list(data[:,0]-data[:,5]), bottom = list(data[:,5]), color = 'red', label = 'UAL payment') #pay - normal cost
	plt.bar(list(time_range), list(data[:,4]), bottom = list(data[:,0]), color = 'Turquoise', label = 'Tax') #tax
	plt.bar(list(range(2020, 2035)), pob[3:], bottom = list((data[:,4])+data[:,0])[:15], color = 'MediumPurple', label='POB') # POB
	plt.legend()
	plt.show()


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


#Amortization period
def calculate_amortization(amperiod, ual, sual, RRinf_monthly, monthly_payroll_growthrate, month_val, year, payroll_total, normal_cost, monthly_normalcost_growthrate, ual_growth):
	pay2019 = 1302.71
	data = []
	ual_growth_monthly = ual_growth ** (1/12)
	paid = False
	sual_list= [sual]

	#discount takes out interest rate over the full period of time
	discount = (1 - (monthly_payroll_growthrate / RRinf_monthly) ** (amperiod * 12)) / (RRinf_monthly - monthly_payroll_growthrate)
	ual_pay_monthly = ual / discount
	normal_cost = normal_cost / month_val

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
			if year > 2036:
				monthly_payroll = payroll_total[2036] / month_val * monthly_payroll_growthrate ** ((year-2037) * 12 + i + 1)
			else:
				monthly_payroll = payroll_total[year] / 12

			nc = get_normal_cost(i, year)
			cr = get_contribution_rate(i, year)
			calculated_contribution = get_contributions(i, year)
			calculated_normal_cost = nc * calculated_contribution

			#accumulate the yearly totals
			payroll += monthly_payroll
			pay += ual_pay_monthly
			normal_cost_annual += calculated_normal_cost

			#now update the values for each month
			ual = ual * ual_growth_monthly - ual_pay_monthly
			ual_pay_monthly = ual_pay_monthly * monthly_payroll_growthrate
			if ual <= 0:
				paid = True

		contribution_rate = pay / payroll
		data.append([pay, ual, contribution_rate, normal_cost_annual])
		year = year + 1
		amperiod = amperiod - 1
	return data, year, paid


#contribution rate as a portion of payroll
def calculate_contribution_rate(contribution_rate, ual, sual, RR, inflation, year, payroll_total, month_val, monthly_payroll_growthrate, RRinf_monthly, ual_growth):
	pay2019 = 1451.26973004236
	data = []
	#RRinf = RR + inflation - 1
	RRinf = RR
	ual_growth_monthly = ual_growth ** (1/12)
	paid = False

	while ual > 0:
		if year >= 2120:
			break
		if ual <= 0 and sual != 0 and (sual_list[year-2020] < 0):
			break

		pay = 0
		contribution = 0
		normal_cost = 0
		for i in range(0, 12):
			if year <= 2036:
				payroll = payroll_total[year]

			if ual <= 0:
				paid = True
				print("Year: {}, month: {}".format(year, i+1))
			if year > 2022:
				monthly_payroll = (payroll_total[2022] / month_val * monthly_payroll_growthrate ** ((year-2022) * 12 + i)) #* contribution_rate
			else:
				monthly_payroll = (payroll_total[year] / month_val) * monthly_payroll_growthrate ** i

			nc = get_normal_cost(i, year)
			cr = get_contribution_rate(i, year)
			calculated_contribution = get_contributions(i, year)
			calculated_normal_cost = nc * calculated_contribution
			monthly_contribution = monthly_payroll * contribution_rate
			ual_payment = monthly_contribution - calculated_normal_cost
			if year == 2020 and i == 0:
				ual = (ual - pay2019) * ual_growth
			else:
				ual = ual * ual_growth_monthly - ual_payment

			pay += ual_payment
			contribution += monthly_contribution
			normal_cost += calculated_normal_cost

		if year >= 2036:
			payroll_total_annual = payroll_total[2036]
		else:
			payroll_total_annual = payroll_total[year]

		data.append([pay, ual, contribution / payroll_total_annual, normal_cost])
		year = year + 1

	return data, year, paid


#contribution rate as a portion of payroll
def calculate_contribution(contribution, ual, sual, RR, inflation, year, payroll_total, month_val, monthly_payroll_growthrate, RRinf_monthly, ual_growth):
	year = 2020
	pay2019 = 1451.26973004236
	monthly_contribution = contribution / month_val
	#RRinf = RR + inflation - 1
	RRinf = RR
	data = []
	ual_growth_monthly = ual_growth ** (1/12)
	paid = False
	inflation_monthly = inflation ** (1/12)

	while ual > 0:
		if year >= 2120:
			break
		if ual <= 0 and sual != 0 and (sual_list[year-2020] < 0):
			break

		pay = 0
		contribution = 0
		normal_cost = 0
		for i in range(0, 12):
			if year <= 2036:
				payroll = payroll_total[year]
			if ual <= 0:
				paid = True
				print("Year: {}, month: {}".format(year, i+1))
			if year > 2022:
				monthly_payroll = (payroll_total[2022] / month_val * monthly_payroll_growthrate ** ((year-2022) * 12 + i)) #* contribution_rate
			else:
				monthly_payroll = (payroll_total[year] / month_val) * monthly_payroll_growthrate ** i

			nc = get_normal_cost(i, year)
			cr = get_contribution_rate(i, year)
			calculated_contribution = get_contributions(i, year)
			calculated_normal_cost = nc * calculated_contribution
			monthly_contribution = (monthly_contribution - calculated_normal_cost) * inflation_monthly + calculated_normal_cost
			ual_payment = monthly_contribution - calculated_normal_cost
			if year == 2020 and i == 0:
				ual = (ual - pay2019) * ual_growth
			else:
				ual = ual * ual_growth_monthly - ual_payment

			pay += ual_payment
			contribution += monthly_contribution
			normal_cost += calculated_normal_cost

		if year >= 2036:
			payroll_total_annual = payroll_total[2036]
		else:
			payroll_total_annual = payroll_total[year]

		data.append([pay, ual, contribution / payroll_total_annual, normal_cost])
		year = year + 1

	return data, year, paid

def get_command_line_args():
	question = int(sys.argv[1]) #which path to go down; options are 1,2,3
	question_param = float(sys.argv[2]) #either amperiod, contribution rate, or contribution depending on question
	ual = int(sys.argv[3]) #suggest 26600
	sual = int(sys.argv[4]) #suggest 0
	RR = float(sys.argv[5]) #rate of return; suggest 1.042
	inflation = float(sys.argv[6]) #suggest 1.03
	tax = float(sys.argv[7]) #suggest 0
	return question, question_param, ual, sual, RR, inflation, tax


def main():
	question, question_param, ual, sual, RR, inflation, tax = get_command_line_args()
	if sual != 0:
		ual = ual-sual

	### A bunch of constants here - some may or may not be used. Sorry! ###
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

	# some constant monthly growthrates, we assume 3.5% per year for these
	monthly_payroll_growthrate = monthly_normalcost_growthrate = 1.035 ** (1/12)
	#RRinf = RR + inflation - 1
	RRinf = RR
	RRinf_monthly = RRinf ** (1/12)
	# UAL should continue to grow at a constant rate regardless of inflation and/or RR
	ual_growth = 1.072
	# this is the "value" of the number of months in a year accounting for payroll growthrate. weird, I know.
	month_val =  1
	month_interest = 1
	for i in range(0, 11):
		month_interest *= monthly_payroll_growthrate
		month_val += month_interest

	if question == 1:
		data, end_year, paid = calculate_amortization(question_param, ual, sual, RRinf_monthly, monthly_payroll_growthrate, month_val, year, payroll_total, normal_cost, monthly_normalcost_growthrate, ual_growth)
	elif question == 2:
		data, end_year, paid = calculate_contribution_rate(question_param, ual, sual, RR, inflation, year, payroll_total, month_val, monthly_payroll_growthrate, RRinf_monthly, ual_growth)
	elif question == 3:
		data, end_year, paid = calculate_contribution(question_param, ual, sual, RR, inflation, year, payroll_total, month_val, monthly_payroll_growthrate, RRinf_monthly, ual_growth)

	if paid == False or end_year >= 2060:
		return paid

	sual_list, tax_list, sualend_year = raisethemoney(sual, tax, RR, end_year, inflation)
	data = np.asarray(data)

	#force them in
	if sual_list.shape[0] > data.shape[0]:
		data = np.pad(data, ((0,sual_list.shape[0] - data.shape[0]),(0,0)), 'constant')
	elif sual_list.shape[0] < data.shape[0]:
		sual_list = np.pad(sual_list, (0, data.shape[0]-sual_list.shape[0]), 'constant')
		tax_list = np.pad(tax_list, (0, data.shape[0]-tax_list.shape[0]), 'constant')

	data=np.insert(data, 3, sual_list, axis = 1)
	data=np.insert(data, 4, tax_list, axis =1)

	if data.shape[0] < 15:
		data = np.pad(data, ((0, 15 -  data.shape[0]),(0,0)), 'constant')

	plotstuff(data, UAL_hist, normalcost_hist, UALpayment_hist, POB_hist, pob)
	return paid

if __name__=="__main__":
	main()