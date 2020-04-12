### MARS

library(data.table)
setwd("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S2/BC3409 AI in Acct & Finance/zzPA")
dt <- fread("STI Main Dataset.csv")
dt[, Date := NULL]
dt[, Up1Down0 := NULL]

# Linear Model

m1 <- lm(STILag0 ~ ., data = dt)
summary(m1)
RMSE.m1 <- sqrt(mean(residuals(m1) ^ 2))
RMSE.m1 # 16.2014

library(earth)
set.seed(2020)

mars <- earth(STILag0 ~ ., degree = 2, nfold = 10, data = dt)
summary(mars)
predict.mars <- predict(mars)
RMSE.mars <- sqrt(mean((dt$STILag0 - predict.mars) ^ 2))
RMSE.mars # 16.24309

(RMSE.m1 - RMSE.mars) / RMSE.m1
## MARS RMSE deproved by 0.26% compared to Linear Regression

# https://www.researchgate.net/post/Is_it_a_common_approach_to_use_MARS_in_case_of_a_multiple_linear_regression_in_which_heteroscedasticity_exists
# https://www.cis.upenn.edu/~ungar/Datamining/Publications/tale2.pdf <<< multicollinearity makes it worse than linear

