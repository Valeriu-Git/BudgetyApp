

var UIController=(function(){

  return{
    addElement:function(type,descr,sum)
    {
      var button=document.createElement("input");
      button.type="image";
      button.src=stat+"cancel.png";
      button.alt="Submit";
      button.className="delete";
      var form= document.createElement("form");
      form.appendChild(button);
      var val=document.createElement("div");
      val.className="value "+type;
      val.innerHTML=sum;
      var description=document.createElement("div");
      description.className="transaction-description";
      description.innerHTML=descr;
      transaction=document.createElement("div");
      transaction.className="transaction-nr";
      transaction.appendChild(description);
      transaction.appendChild(val);
      transaction.appendChild(form);
      if(type=="income")
        {
          var container=document.querySelector(".income-transactions");
        }
        else
        {
          var container=document.querySelector(".expense-transactions");
        }
        container.appendChild(transaction);
    },

    toggleTransaction:function()
    {
      var select=document.querySelector(".type-transaction");
      var description_form=document.querySelector(".form.text");
      var value_form=document.querySelector(".form.number");
      var tick=document.querySelector(".tick");
      select.classList.toggle("red");
      description_form.classList.toggle("red");
      value_form.classList.toggle("red");
      if(tick.getAttribute("src")==stat+"bluetick.png")
        tick.src=stat+"tick.png";
      else
        tick.src=stat+"bluetick.png";

    },
    typeOfTransaction:function()
    {
      var select=document.querySelector(".type-transaction");
      var type_of_trasaction=select.options[select.selectedIndex].value;
      return type_of_trasaction;
    },
    checkFields:function()
    {
      var field_description=document.querySelector(".form.text");
      var field_value=document.querySelector(".form.number");
      if(field_description.value==""||field_value.value=="" || parseInt(field_value.value)<0)
        return false;
      return true;
    },
    getUserFields:function()
    {
      descr=document.querySelector(".form.text").value;
      sum=document.querySelector(".form.number").value;
      sum=parseInt(sum)
      return {
        description:descr,
        sum:sum
      }
    },
    emptyForms:function()
    {
      document.querySelector(".form.text").value="";
      document.querySelector(".form.number").value="";
    },
    UpdateBudget:function(income,expense,balance)
    {
      document.querySelector(".balance-value").innerHTML=balance+"$";
      document.querySelector(".income-value").innerHTML=income+"$";
      document.querySelector(".expense-value").innerHTML=expense+"$";
    },
    removeTransaction:function(button)
    {
      transaction=button.parentElement.parentElement;
      transaction.style.position="relative";
      if(transaction.parentElement.classList.contains("income-transactions"))
        transaction.style.transform="translateX(-1000px)";
      else
        transaction.style.transform="translateX(1000px)";
      transaction.style.transitionDuration="2.5s";
      var bod=document.getElementsByTagName("body")[0];
      bod.style.overflow="hidden";
      setTimeout(function(){
        transaction.remove();
        bod.style.overflow="visible";
      },1250);
    },
    animateBudget:function()
    {
      var balance=document.querySelector(".balance-value");
      var income=document.querySelector(".income-value");
      var expense=document.querySelector(".expense-value");
      balance.classList.remove("appear");
      income.classList.remove("appear");
      expense.classList.remove("appear");
      void balance.offsetWidth;
      void income.offsetWidth;
      void expense.offsetWidth;
      balance.classList.add("appear");
      income.classList.add("appear");
      expense.classList.add("appear");
    }
  }
})();


var BudgetController=(function(){
  var data={
    totalIncome:0,
    totalExpense:0
  }

  return{
    //calculate the totalIncome
    calculateIncome:function()
    {
      var container=document.querySelector(".income-transactions")
      var income_transactions=container.getElementsByClassName("transaction-nr")
      totalIncome=0
      if(income_transactions.length!=0)
      {
        for(var i=0;i<income_transactions.length;i++)
        {
          var val=parseInt(income_transactions[i].getElementsByClassName("value income")[0].innerHTML)
          totalIncome+=val
        }
      }
      return totalIncome
    },
    calculateExpense:function()
    {
      var container=document.querySelector(".expense-transactions")
      var expense_transactions=container.getElementsByClassName("transaction-nr")
      totalExpense=0
      if(expense_transactions.length!=0)
      {
        for(var i=0;i<expense_transactions.length;i++)
        {
          var val=parseInt(expense_transactions[i].getElementsByClassName("value expense")[0].innerHTML)
          totalExpense+=val
        }
      }
      return totalExpense
    }
  }
})();




var Controller=(function(UICtrl,BCtrl){
  var UserInterface=UICtrl;
  var Budget=BCtrl;

  var SetupListeners=function(){

    window.addEventListener('load',function(){
      UserInterface.UpdateBudget(Budget.calculateIncome(),Budget.calculateExpense(),Budget.calculateIncome()-Budget.calculateExpense());
    })
    //event when we insert a transaction
    document.querySelector(".tick").addEventListener("click",function(){

      if(!UserInterface.checkFields())
        {
          alert("Description or value is invalid")
        }
      else
        {
          var input=UserInterface.getUserFields();
          var type=UserInterface.typeOfTransaction();
          UserInterface.addElement(type,input.description,input.sum);
          UserInterface.UpdateBudget(Budget.calculateIncome(),Budget.calculateExpense(),Budget.calculateIncome()-Budget.calculateExpense());
          UserInterface.animateBudget();
        }
    })

    //event when we change the type of transaction
    document.getElementsByTagName("select")[0].addEventListener("change",function(){
      UserInterface.toggleTransaction();
    })

    //event when we delete a transaction
    document.querySelector("#tranzactionContainer").addEventListener("click",function(e)
    {
      if(e.target &&e.target.classList.contains("delete"))
        {var type;
         e.preventDefault();
         newIncome=Budget.calculateIncome()
         newExpense=Budget.calculateExpense()
        if(e.target.parentElement.parentElement.parentElement.className=="income-transactions")
      {
          type="income";
          removed_value=parseInt(e.target.parentElement.parentElement.querySelector(".value").innerHTML)
          newIncome-=removed_value
      }
        else
        {
          type="expense";
          removed_value=parseInt(e.target.parentElement.parentElement.querySelector(".value").innerHTML)
          newExpense -= removed_value
        }
        descr=e.target.parentElement.parentElement.querySelector(".transaction-description").innerHTML
        val=e.target.parentElement.parentElement.querySelector(".value").innerHTML
        UserInterface.removeTransaction(e.target);
        UserInterface.UpdateBudget(newIncome,newExpense,newIncome-newExpense);
        UserInterface.animateBudget();

        $.ajax({
          type:'POST',
          url:user_page,
          data:{
            description:descr,
            value:val,
            tip:type,
            post_type:'delete',
            csrfmiddlewaretoken:csrf
          }
         })


        }
    })

}
  return{
    init:function()
    {
      SetupListeners();
    }
  }
})(UIController,BudgetController);

Controller.init();
