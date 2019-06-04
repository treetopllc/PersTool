from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_api import status
import numpy as np
import pandas
import logging

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=["POST"])
def post():
    normal_cost = 720.881725

    req = request.json.get("data")
    question = req.get("question")
    if question == 1:
        amperiod= req.get("amperiod")
    if question == 3:
        pay = req.get("pay")
        if pay < normal_cost:
            return "Pay Too Low"
    if question == 2:
        contribution_rate = req.get('contribution_rate')
    ual = req.get('ual')
    sual = req.get('sual')
    RR= req.get('RR')
    inflation = req.get('inflation')
    tax = req.get('tax')

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
        ual = ual - sual

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


    data = []
    resp = []
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
            resp.append([{"pay": pay}, {"ual": ual}, {"contribution_rate": contribution_rate}, {"normal_cost": normal_cost}])
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
            resp.append([{"pay": pay}, {"ual": ual}, {"contribution_rate": contribution_rate}, {"normal_cost": normal_cost}])
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
            resp.append([{"pay": pay}, {"ual": ual}, {"contribution_rate": contribution_rate}, {"normal_cost": normal_cost}])
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
    resp2 = data.tolist()
    return make_response(jsonify(resp), status.HTTP_200_OK)

if __name__ == "__main__":
    app.run()