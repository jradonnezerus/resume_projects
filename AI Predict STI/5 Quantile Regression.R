### Quantile Regression

library(data.table)
setwd("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S2/BC3409 AI in Acct & Finance/zzPA")
dt <- fread("STI Main Dataset.csv")
dt[, Date := NULL]
dt[, Up1Down0 := NULL]

library(quantreg)

# Modelling

summary(dt$STILag0)
m1 <- lm(STILag0 ~ STILag1, data = dt)
summary(m1)
plot(dt$STILag0, dt$STILag1)
abline(m1, lty=2, col='red')

par(mfrow=c(2,2))
plot(m1)
par(mfrow=c(1,1))

m2 <- rq(STILag0 ~ STILag1, tau = .5, data = dt)
abline(m2, col='blue')

m2
summary(m2)
summary(m2, se = "nid")

taus <- c(.05, .1, .25, .75, .90, .95)

for (i in 1:length(taus)){
  abline(rq(dt$STILag0 ~ dt$STILag1, tau=taus[i]), col = "green")
}

table <- data.frame("Tau" = 1:6, "beta0" = 1:6, "beta_Income" = 1:6)

# Plot the 6 percentile grey lines
for( i in 1:length(taus)){
  fit <- rq(dt$STILag0~dt$STILag1,tau=taus[i])
  coef <- coef(fit)
  table$Tau[i] = taus[i]
  table$beta0[i] = coef[1]
  table$beta_Income[i] = coef[2]
  abline(fit, col = "grey")
}

print("Quantile Regression models at Various Percentiles")
table
