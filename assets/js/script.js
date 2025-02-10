document.addEventListener('DOMContentLoaded', async function () {
    const moveBtn = document.getElementById('move');

        if (moveBtn) {
            moveBtn.addEventListener('click', function(e) {
                e.preventDefault()
                location.href = '/student/0'
                //Додайте список і розкоментуйте та налаштуйте перехід: 
                //location.href = '/students/'+ключ людини
            })
        }
})