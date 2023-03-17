
((impl_item
    type: (type_identifier) @result)
(#prefix! @result " (")
(#append! @result ")"))

((impl_item
    trait: (type_identifier) @result)
(#append! @result " trait"))

((impl_item
    trait: (generic_type) @result)
(#append! @result " trait"))
