### CART

library(data.table)
setwd("C:/Users/jrado/Desktop/Fake Thumbdrive/zzY3S2/BC3409 AI in Acct & Finance/zzPA")
dt <- fread("STI Main Dataset.csv")
dt[, Date := NULL]

# CART on Categorical Y

dt[, STILag0 := NULL]

library(rpart)
library(rpart.plot)
set.seed(2020)		# for randomisation in 10-fold CV
m0 <- rpart(Up1Down0 ~ ., data = dt, method = 'class')
prp(m0)

set.seed(2020)
m1 <- rpart(Up1Down0 ~ ., data = dt, method = 'class', control = rpart.control(minsplit = 2, cp = 0))
prp(m1)
prp(m1, type = 2, extra = 104, nn = T, nn.box.col = 'light blue')
print(m1) # to see the tree in the console
printcp(m1, digits=3)
plotcp(m1)

CVerror.cap <- m1$cptable[which.min(m1$cptable[,"xerror"]), "xerror"] + m1$cptable[which.min(m1$cptable[,"xerror"]), "xstd"] # min CV + 1 SE
i <- 1; j <- 4		
while (m1$cptable[i,j] > CVerror.cap) {
  i <- i + 1
}
cp.opt = ifelse(i > 1, sqrt(m1$cptable[i,1] * m1$cptable[i-1, 1]), 1)

set.seed(2020)
m2 <- prune(m1, cp = cp.opt)
print(m2)
prp(m2)

summary(m2)
m2$variable.importance

predicted <- predict(m0, newdata = dt, type = 'class')
table(dt$Up1Down0, predicted)
predicted <- predict(m1, newdata = dt, type = 'class')
table(dt$Up1Down0, predicted)
predicted <- predict(m2, newdata = dt, type = 'class')
table(dt$Up1Down0, predicted)


