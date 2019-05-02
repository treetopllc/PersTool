import numpy as np
import matplotlib.pyplot as plt
import pandas

normal_cost = 720.881725
question = eval(input("Amortization period (1) or Contribution rate (2) or Annual pay (3):") )
if question ==1:
	amperiod=eval(input("Ammortization period (years):"))
if question == 3:
	pay = eval(input("Pay:"))
	while pay < normal_cost:
		print("pay too low, try again")
		pay = eval(input("Pay:"))
if question == 2:
	contribution_rate = eval(input("contribution rate:"))
ual = eval(input("UAL:"))
sual = eval(input("Sequestered UAL:"))
RR= eval(input("Inflation Adjusted Rate of Return:"))
inflation = eval(input("Inflation Rate:"))
tax = eval(input("Tax Per Year:"))

payroll_total = {2020: 11025.585615, 2021: 11347.711070, 2022: 11810.882950, 2023: 12155.951791, 2024: 12652.113088, 2025: 13021.759457, 2026: 13553.259843, 2027: 13949.234274, 2028: 14518.590775, 2029: 14942.768486, 2030: 15552.677403, 2031: 16007.067171, 2032: 16660.416851, 2033: 17147.170530, 2034: 17847.055042, 2035: 18368.477751, 2036: 19118.211537}
pob = (573.4343585, 596.8398425,605.7471839, 630.4715587, 647.8775716, 674.3215541, 676.224210, 703.8251982, 744.2061759,  774.5819382,  326.541601,  339.8698296, 199.5221645,  20.76659263,  13.14852491,  13.6851994, 6.706822572,  6.980570433)


#read in historical data
hist_data = pandas.read_csv('historical.csv')
normalcost_hist = hist_data.NormalCost.tolist()
pay_hist = hist_data.Pay.tolist()
UALpayment_hist = hist_data.UALpayment.tolist()
POB_hist = hist_data.POB.tolist()
UAL_hist = hist_data.UAL.tolist()

if sual != 0:
	ual = ual-sual



def raisethemoney(sual, tax, RR):
	year = 2020
	sual_list= [sual]
	tax_list = [tax]
	while sual > 0:
		sual = (sual - tax) * (RR + inflation-1)
		if year >= 2120:
			print("Tax too low")
			break
		#if ual<= 0:
			#normal_cost=normal_cost*1.035
		#data.append([normal_cost])
		tax = tax * inflation
		year = year + 1
		sual_list.append(sual)
		tax_list.append(tax)
	return np.asarray(sual_list), np.asarray(tax_list), year

def plotstuff(data):
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

data = []
sual_list, tax_list, sualend_year = raisethemoney(sual,tax,RR)


if question == 1: #if give ammortization period
	year = 2020
	pay2019 = 1302.71
	RRinf = RR + inflation-1
	discount = (1-((inflation)/(RRinf))**amperiod)/(RRinf-inflation)
	ual_pay = (ual-pay2019)/ discount #ual_pay = (ual- pay2019)/ discount
	pay= normal_cost+ual_pay
	ual=ual-pay2019*(RRinf)-ual_pay
	while amperiod > 0:
		if year >= 2120:
			break
		print(ual)
		print(sual_list)
		if ual <= 0 and sual != 0 and (sual_list[year-2020] < 0):
			break
		if year > 2036:
			payroll = payroll_total[2036] * (1.035)**(year-2036)
			contribution_rate = (pay)/payroll
		else:
			contribution_rate = (pay)/payroll_total[year]
		#if year == 2021:
			#ual = (ual-pay2019)*(RRinf)-ual_pay

		#else:
			#ual = (ual*(RRinf)-ual_pay)
		#print(f"Pay: {pay}   UAL: {ual}   CR: {contribution_rate} UAL_Payment: {ual_pay}   NC: {normal_cost}")
		data.append([pay, ual, contribution_rate, normal_cost])
		ual = (ual*(RRinf)-ual_pay)
		normal_cost = normal_cost * 1.035
		ual_pay=ual_pay*inflation
		year = year + 1
		amperiod = amperiod -1
		#problem: contribution rate falling because payments are not inflation-adjusted. 
		


if question == 2: #if contribution rate
	year = 2020
	while ual > 0:
		if year >= 2120:
			break
		if ual <= 0 and sual != 0 and (sual_list[year-2020] < 0):
			break
		if year >= 2036:
			try:
				pay = payroll_total[year]*1.035 * contribution_rate
			except:
				pay = pay*1.035
		else:
			pay = payroll_total[year]*contribution_rate

		print(f"Pay: {pay}   UAL: {ual}   CR: {contribution_rate} UAL_Payment: {pay-normal_cost}   NC: {normal_cost}")
		data.append([pay, ual, contribution_rate, normal_cost])
		ual = (ual*(RR+inflation-1)-(pay-normal_cost)) # before was: ual = (ual - (pay-normal_cost)) * (RR +inflation -1)
		year = year + 1
		normal_cost = normal_cost * 1.035
		pay = (normal_cost)+ (pay - normal_cost) * 1.035
	#while sual>=0 and ual<=0:
		#if year>=2120:
			#break
		#data.append([normal_cost])
		#normal_cost = normal_cost * 1.035
		
	print(f"Took {year - 2020} years")

if question == 3:
	year = 2020
	while ual >= 0:
		if year >= 2120:
			break
			print("Pay probably needs to be higher")
		print(ual)
		print(sual_list)
		if ual <= 0 and sual !=0 and (sual_list[year-2020] < 0):
			break
		if year > 2036:
			payroll = payroll_total[2036] * (1.035)**(year-2036)
			contribution_rate = pay/payroll
		else:
			contribution_rate = pay/payroll_total[year]
		#print(f"Pay: {pay}   UAL: {ual}   CR: {contribution_rate}")
		data.append([pay, ual, contribution_rate, normal_cost])
		ual = (ual * (RR + inflation-1)) - (pay-normal_cost) # was: (ual - (pay-normal_cost)) * (RR + inflation-1)
		normal_cost = normal_cost * 1.035
		pay = (normal_cost)+ (pay - normal_cost) * inflation 
		year = year + 1
		print(f"Took {year - 2020} years")

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
	
plotstuff(data)


	#List of things to do  
	#3) correct code for other 2 options, 4) make the graph pretty, 5) test against excel results
	#6) Make UAL either with or without side accounts
	#7) Figure out how UAL subtraction should be calculated (should probably be the printed version, but then need to figure out the proper math for #1)







