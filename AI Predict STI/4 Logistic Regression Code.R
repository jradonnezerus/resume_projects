### Logistic Regression

library(data.table)
setwd("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S2/BC3409 AI in Acct & Finance/zzPA")
dt <- fread("STI Main Dataset.csv")
dt[, Date := NULL]
dt[, STILag0 := NULL]

# Train-Test Split
library(caTools) 
set.seed(2020)

train <- sample.split(Y = dt$Up1Down0, SplitRatio = 0.7)
trainset <- subset(dt, train == T)
testset <- subset(dt, train == F)

prop.table(table(trainset$Up1Down0))
prop.table(table(testset$Up1Down0))

## Logistic Regression Model

m1 <- glm(Up1Down0 ~ ., family = binomial, data = trainset)
summary(m1) # remove the non-significant ones

OR <- exp(coef(m1))
OR
OR.CI <- exp(confint(m1))
OR.CI

threshold <- 0.5
prob.train <- predict(m1, type = 'response') # predicted probability
predict.train <- ifelse(prob.train > threshold, 1, 0)
table.train <- table(trainset$Up1Down0, predict.train)
table.train # table with whole numbers
round(prop.table(table.train), 3) # proportion table
cat("Trainset Overall Accuracy Rate: ", round(mean(predict.train == trainset$Up1Down0), 3), "\n")

prob.test <- predict(m1, newdata = testset, type = 'response')
predict.test <- ifelse(prob.test > threshold, 1, 0)
table.test <- table(testset$Up1Down0, predict.test)
table.test
round(prop.table(table.test), 3)
cat("Testset Overall Accuracy Rate: ", round(mean(predict.test == testset$Up1Down0), 3), "\n")

# See from testset confusion matrix how many false positives and negatives.

# Evaluate

model_null <- glm(Up1Down0 ~ 1, family = binomial, data = trainset)
anova(model_null, m1, test="Chisq")

# Reduced Model

m2 <- glm(Up1Down0 ~ STILag1 + SnP500 + UKFTSE + KLSE + CrudeOilSGD + SGMSCIFutures + `US-SGD` + `EUR-SGD` + `JPY-SGD`, family = binomial, data = trainset)
summary(m2) # remove the non-significant ones

OR <- exp(coef(m2))
OR
OR.CI <- exp(confint(m2))
OR.CI

threshold <- 0.5
prob.train <- predict(m2, type = 'response') # predicted probability
predict.train <- ifelse(prob.train > threshold, 1, 0)
table.train <- table(trainset$Up1Down0, predict.train)
table.train # table with whole numbers
round(prop.table(table.train), 3) # proportion table
cat("Trainset Overall Accuracy Rate: ", round(mean(predict.train == trainset$Up1Down0), 3), "\n")

prob.test <- predict(m2, newdata = testset, type = 'response')
predict.test <- ifelse(prob.test > threshold, 1, 0)
table.test <- table(testset$Up1Down0, predict.test)
table.test
round(prop.table(table.test), 3)
cat("Testset Overall Accuracy Rate: ", round(mean(predict.test == testset$Up1Down0), 3), "\n")

# Evaluate

model_null <- glm(Up1Down0 ~ 1, family = binomial, data = trainset)
anova(model_null, m2, test="Chisq")
