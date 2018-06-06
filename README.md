# Behavior Risks
Data was taken from the 2014 ACS one-year estimates from the [American FactFinder](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) tool and the 2014 survey data from the [Behavioral Risk Factor Surveillance System](https://chronicdata.cdc.gov/Behavioral-Risk-Factors/BRFSS-2014-Overall/5ra3-ixqq) tool. 

Three demographics were selected: individuals in the labor force, in poverty, and divorced. Three behavioral risk factors were selected: individuals with depression, were on the Internet in the last 30 days, and smoked. The data is saved in `data.csv`.

D3 was used to read the CSV file and create the dynamic scatterplots. A correlation equal to or greater than +0.50 OR equal to or less than -0.50 between the demographic and behavioral risk was considered for analysis. 

The html page can be found at [https://victoria-lam.github.io/Behavior_Risks/](https://victoria-lam.github.io/Behavior_Risks/).
