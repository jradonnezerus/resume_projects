### 0 Data Exploration

library(data.table)
setwd("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S2/BC3409 AI in Acct & Finance/zzPA")
dt <- fread("STI Main Dataset.csv")

head(dt)
str(dt)
dt$Up1Down0 <- factor(dt$Up1Down0)
summary(dt)

# Graphs
plot(x = dt$STILag0, type = "l", col="red")
lines(x = dt$STILag1, type = "l", col="green")

boxplot(dt$STILag0) # few outliers
boxplot(dt$STILag1)
boxplot(dt$SnP500)
boxplot(dt$DowJones)
boxplot(dt$UKFTSE)
boxplot(dt$HSI)
boxplot(dt$KLSE) # few outliers
boxplot(dt$CrudeOilSGD)
boxplot(dt$SGMSCIFutures) # few outliers
boxplot(dt$`US-SGD`)
boxplot(dt$`EUR-SGD`)
boxplot(dt$`GBP-SGD`)
boxplot(dt$`JPY-SGD`) # some outliers
boxplot(dt$USEFFR)
boxplot(dt$SORA) # some outliers

barplot(table(dt$Up1Down0), col=c("lavender", "pink"))