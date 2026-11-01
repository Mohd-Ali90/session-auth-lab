const router = require("express").Router()
const User = require('../models/User')
const Entry = require('../models/Entry')
const isSignedIn = require('../middleware/is-signed-in')

router.get('/new',isSignedIn,(req,res)=>{
    res.render('entries/new-entry.ejs')
})

router.post('/new',isSignedIn, async (req,res)=>{
    // console.log(req.session.user)
if (req.body.isPublic === 'on') {
    req.body.isPublic = true
} else {
    req.body.isPublic = false
}

    const newEntry = await Entry.create({
        title: req.body.title,
        entryBody: req.body.entryBody,
        isPublic: req.body.isPublic,
        owner: req.session.user._id
    })

    res.redirect('/entries/')
})

router.get('/', async (req,res)=>{
    const foundEntry= await Entry.find({isPublic:true})
    console.log(foundEntry)
    res.render('entries/all-entries.ejs',{entries:foundEntry})
})

router.get('/my-entries' ,isSignedIn, async (req,res)=>{
const foundMyEntry = await Entry.find({owner:req.session.user._id})
res.render('entries/my-entries.ejs',{entries:foundMyEntry})
})

router.delete('/:entryId/delete',async (req,res) =>{
console.log('DELETE ENTRY')
const deletedEntry = await Entry.findByIdAndDelete(req.params.entryId)
res.redirect('/entries/my-entries')
})

router.get('/:entryId/edit', isSignedIn , async (req,res)=>{
    const foundEntry = await Entry.findById(req.params.entryId)
    res.render('entries/edit-entry.ejs',{entry:foundEntry})
})


router.put('/:entryId' , isSignedIn , async (req,res)=>{
if (req.body.isPublic === 'on') {
    req.body.isPublic = true
} else {
    req.body.isPublic = false
}
const updatedentry = await Entry.findByIdAndUpdate(req.params.entryId, req.body)
    res.redirect('/entries/my-entries')

})
module.exports = router;

