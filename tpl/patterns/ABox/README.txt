###
# PATTERN SCHEMA 
###

# for every pattern creates an individual (with its namespace)
# the individual is of type opla:Pattern
# the individual may be related opla:specializationOfPattern with other individual

###
# PATTERN DATA
###

# for every instance retrieved by the query
#    create an instance 
#    assign resource to the instance



#### TODO
# study the null mechanism to avoid double instantiation when composition!
# check if you can create a list on the fly example: :MyTemplate([?var1, ?var2], x)

# none keywords works in list as is
# in templates you need to assign ? flag to the param you want nullable, else 
# all the instance won't be print

# you can assign default values