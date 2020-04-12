### Linear Regression

library(data.table)
setwd("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S2/BC3409 AI in Acct & Finance/zzPA")
dt <- fread("STI Main Dataset.csv")
dt[, Date := NULL]
dt[, Up1Down0 := NULL]

# Correlation
cor(dt)
library(corrplot) 
corrplot(cor(dt), type = "lower", main = "Chart Name", cex.main = 0.9, mar = c(0, 0, 2, 0))
pairs(~ . , panel = panel.smooth, data = dt, main = "Chart Name", cex.main = 0.9)
        
# Train-Test Split
library(caTools)
set.seed(2020)
        
train <- sample.split(Y = dt$STILag0, SplitRatio = 0.7)
trainset <- subset(dt, train == T)
testset <- subset(dt, train == F)
        
summary(trainset$STILag0)
summary(testset$STILag0)

## Linear Regression Model (Full)

m1 <- lm(STILag0 ~ ., data = trainset)
summary(m1)

RMSE.m1.train <- sqrt(mean(residuals(m1)^2)) # RMSE on trainset based on m1. THIS IS 16.1176520704562.
summary(abs(residuals(m1))) # check Min and Max Absolute Errors
# TRAINSET RMSE tells me on average, the error of using the model vs actual is that value
        
predict.m1.test <- predict(m1, newdata = testset) # the Y hat for testset
testset.error <- testset$STILag0 - predict.m1.test
RMSE.m1.test <- sqrt(mean(testset.error^2)) # THIS IS 16.4314421277126.
summary(abs(testset.error)) # compare this with the trainset errors

## Linear Regression Model (Backward Elimination)

m2 <- step(m1)
summary(m2) # dropped HSI, GBP-SGD, and SORA

# Model Diagnostic Plot
par(mfrow = c(2, 2))
plot(m2)
par(mfrow = c(1, 1)) 

# Detecting Multicollinearity
library(car)
vif(m2)

RMSE.m2.train <- sqrt(mean(residuals(m2)^2)) # RMSE on trainset based on m1. THIS IS 16.1192402033958.
summary(abs(residuals(m2))) # check Min and Max Absolute Errors
# TRAINSET RMSE tells me on average, the error of using the model vs actual is that value

predict.m2.test <- predict(m2, newdata = testset) # the Y hat for testset
testset.error <- testset$STILag0 - predict.m2.test
RMSE.m2.test <- sqrt(mean(testset.error^2)) # THIS IS 16.4372897934998.
summary(abs(testset.error)) # compare this with the trainset errors

## Linear Regression Model (Forward Elimination)
m.null <- lm(STILag0 ~ 1, data = trainset)
m3 <- step(m.null, formula(m1), direction = "forward")
summary(m3) # never take up SORA and HSI, but got take up GBP-SGD.

# Model Diagnostic Plot
par(mfrow = c(2, 2))
plot(m3)
par(mfrow = c(1, 1)) 

# Detecting Multicollinearity
library(car)
vif(m3)

RMSE.m3.train <- sqrt(mean(residuals(m3)^2)) # RMSE on trainset based on m1. THIS IS 16.1185714366802.
summary(abs(residuals(m3))) # check Min and Max Absolute Errors
# TRAINSET RMSE tells me on average, the error of using the model vs actual is that value

predict.m3.test <- predict(m3, newdata = testset) # the Y hat for testset
testset.error <- testset$STILag0 - predict.m3.test
RMSE.m3.test <- sqrt(mean(testset.error^2)) # THIS IS 16.4396455109731.
summary(abs(testset.error)) # compare this with the trainset errors
